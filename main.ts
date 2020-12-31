import { App, Modal, Notice, Plugin, PluginSettingTab, Setting, PluginManifest } from 'obsidian';
import { Pos } from 'codemirror'

interface TaskStateNotesPluginSettings {
	todoName: string;
	doneName: string;
}

const DEFAULT_SETTINGS: TaskStateNotesPluginSettings = {
	todoName: 'TODO',
	doneName: 'DONE',
}

export default class TaskStateNotesPlugin extends Plugin {
	settings: TaskStateNotesPluginSettings
	cmRef: CodeMirror.Editor

	constructor(app: App, manifest: PluginManifest) {
		super(app, manifest)

		this.handleCmChanged = this.handleCmChanged.bind(this)
	}

	async onload() {
		console.log('loading plugin');

		await this.loadSettings()

		this.registerCodeMirror((cm: CodeMirror.Editor) => {
			this.cmRef = cm
			cm.on('change', this.handleCmChanged)
		})
	}

	onunload() {
		console.log('unloading plugin');

		this.cmRef?.off('change', this.handleCmChanged)
	}

	handleCmChanged(cm: CodeMirror.Editor, changeObj: CodeMirror.EditorChangeLinkedList) {
		if (changeObj.origin === 'setValue') {
			return
		}

		changeObj.text.forEach(text => {
			const {todoName, doneName} = this.settings

			if (text.endsWith('- [ ] ')) {
				const doc = cm.getDoc()
				const cursor = doc.getCursor()

				doc.replaceRange(`[[${todoName}]] `, cursor)

				return
			}

			if (text.includes(`[ ] [[${doneName}]]`) && changeObj.removed?.[0]?.includes(`[x] [[${doneName}]]`) === true) {
				this.replaceLine(cm, text, `[[${doneName}]]`, `[[${todoName}]]`)
			}

			if (text.includes(`[x] [[${todoName}]]`) && changeObj.removed?.[0]?.includes(`[ ] [[${todoName}]]`) === true) {
				this.replaceLine(cm, text, `[[${todoName}]]`, `[[${doneName}]]`)
			}
		})
	}

	replaceLine(cm: CodeMirror.Editor, text: string, from: string, to: string) {
		const doc = cm.getDoc()
		const cursor = doc.getCursor()

		const newText = text.replace(from, to)
		doc.setSelection(Pos(cursor.line, 0), Pos(cursor.line, cursor.ch))
		doc.replaceSelection(newText)
	}

	async loadSettings() {
		this.settings = Object.assign(DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
