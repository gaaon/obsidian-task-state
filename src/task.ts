export class TaskStateService {
  startState: string
  endState: string
  toggleTaskPattern: RegExp

  constructor(private states: string[]) {
    if (!this.states || this.states.length < 2) {
      throw new Error('states should have length equals or more than 2')
    }

    this.startState = states[0]
    this.endState = states[states.length - 1]
    this.toggleTaskPattern = new RegExp(`- \\[( |x)\\] \\[\\[(${this.states.join('|')})\\]\\]`)
  }

  getStartState() {
    return this.startState
  }

  getEndState() {
    return this.endState
  }

  canAddTaskState(line: string): boolean {
    return line.endsWith('- [ ] ')
  }

  addTaskState(line: string, cb: (newText: string) => void) {
    if (!this.canAddTaskState(line)) {
      return
    }

		const addTaskPattern = new RegExp(`- \\[ \\] $`)
		const newLine = line.replace(addTaskPattern, `- [ ] [[${this.startState}]] `)
		cb(newLine)
  }
  
  canToggleTaskState(removed: string|undefined, line: string, origin: string|undefined): boolean {
    return this.toggleTaskPattern.test(line) && 
      removed !== undefined && 
      origin === undefined &&
      this.toggleTaskPattern.test(removed)
  }

  toggleTaskState(removed: string|undefined, line: string, origin: string|undefined, cb: (newText: string) => void) {
    if (!this.canToggleTaskState(removed, line, origin)) {
      return
    }

    const executed = this.toggleTaskPattern.exec(line)
    if (executed === null || executed.length < 2) {
      return
    }

    const [_, marked, state] = executed
    const toggledState = this.getToggledState(state, marked)
    if (toggledState === null) {
      return
    }

    const newLine = line.replace(`[[${state}]]`, `[[${toggledState}]]`)
    cb(newLine)
  }

  private getToggledState(state: string, marked: string): string|null {
    switch (marked) {
      case 'x': return this.endState
      case ' ': return this.startState
      default: return null
    }
  }
}