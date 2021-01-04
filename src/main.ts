import { App, Modal, Notice, Plugin, PluginSettingTab, Setting, PluginManifest, KeymapEventHandler, Scope } from 'obsidian';
import { Pos } from 'codemirror';
import { TaskStateService } from './task';

interface TaskStateNotesPluginSettings {
	todoState: string;
	doneState: string;
	enableAutoAdd: boolean;
	enableAutoToggle: boolean;
}

const DEFAULT_SETTINGS: TaskStateNotesPluginSettings = {
	todoState: 'TODO',
	doneState: 'DONE',
	enableAutoAdd: true,
	enableAutoToggle: true,
}

export default class TaskStateNotesPlugin extends Plugin {
	private settings: TaskStateNotesPluginSettings
	private cmRef: CodeMirror.Editor|undefined
	private taskStates: string[]
	private taskStateService: TaskStateService

	constructor(app: App, manifest: PluginManifest) {
		super(app, manifest)

		this.handleCmChanged = this.handleCmChanged.bind(this)
		// this.canInsertTaskState = this.canInsertTaskState.bind(this)
	}

	async onload() {
		console.log('loading plugin task-state');

		await this.loadSettings()
		this.taskStates = [this.settings.todoState, this.settings.doneState]
		this.taskStateService = new TaskStateService(this.taskStates)

		this.registerCodeMirror((cm: CodeMirror.Editor) => {
			this.cmRef = cm
			cm.on('change', this.handleCmChanged)
		})
	}

	onunload() {
		console.log('unloading plugin task-state');

		this.cmRef?.off('change', this.handleCmChanged)
	}

	handleCmChanged(cm: CodeMirror.Editor, changeObj: CodeMirror.EditorChangeLinkedList) {
		if (changeObj.origin === 'setValue') {
			return
		}

		if (changeObj.origin === 'undo') {
			return
		}

		const {enableAutoAdd, enableAutoToggle} = this.settings

		changeObj.text.forEach(text => {
			// 1. hit `cmd + enter` in empty line
			// 2. hit `enter` after line with task bracket [ ]
			if (enableAutoAdd && this.taskStateService.canAddTaskState(text)) {
				this.taskStateService.addTaskState(text, (newText) => {
					this.replaceCodeMirrorLine(cm, newText)
				})
				return
			}

			// 1. hit `cmd + enter` in content-filled line without task bracket [ ]
			// if (this.canInsertTaskState(text)) {
				// this.insertTaskState(cm, text, todoState)
				// return
			// }

			// 1. hit `cmd + enter` in line with task state
			const removed: string|undefined = changeObj.removed?.[0]
			const origin = changeObj.origin
			if (enableAutoToggle && this.taskStateService.canToggleTaskState(removed, text, origin)) {
				this.taskStateService.toggleTaskState(removed, text, origin, (newText) => {
					this.replaceCodeMirrorLine(cm, newText)
				})
				return
			}
		})
	}

	replaceCodeMirrorLine(cm: CodeMirror.Editor, newText: string) {
		const doc = cm.getDoc()
		const cursor = doc.getCursor()

		doc.setSelection(Pos(cursor.line, 0), Pos(cursor.line, cursor.ch))
		doc.replaceSelection(newText)
	}

	// canInsertTaskState(text: string) {
	// 	for (const taskState of this.taskStates) {
	// 		if ((new RegExp(`- \\[( |x)\\] \\[\\[${taskState}\\]\\]`)).test(text)) {
	// 			return false
	// 		}
	// 	}

	// 	return true
	// }

	// insertTaskState(cm: CodeMirror.Editor, text: string, state: string) {
	// 	const doc = cm.getDoc()
	// 	const cursor = doc.getCursor()

	// 	const insertTaskPattern = new RegExp(`- \\[( |x)\\] `)

	// 	const newText = text.replace(insertTaskPattern, `- [$1] [[${state}]] `)
	// 	console.log(newText)
	// 	console.log('can insert')
	// 	return

	// 	doc.setSelection(Pos(cursor.line, 0), Pos(cursor.line, cursor.ch))
	// 	doc.replaceSelection(newText)
	// }

	async loadSettings() {
		this.settings = Object.assign(DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
