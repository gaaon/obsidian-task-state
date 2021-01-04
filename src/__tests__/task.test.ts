import { TaskStateService } from "src/task"

describe('task state service', () => {
  let taskStateService: TaskStateService
  const taskStates: string[] = ['TODO', 'IN_PROGRESS', 'DONE']
  const firstState = taskStates[0]
  const lastState = taskStates[taskStates.length - 1]

  beforeEach(() => {
    taskStateService = new TaskStateService(taskStates)
  })

  describe('add task state', () => {
    describe('when line needs task state', () => {
      const linesToNeedTaskState = [
        '- [ ] ',
        '  - [ ] ',
      ]
  
      linesToNeedTaskState.forEach((line, idx) =>
        test(`should execute callback with line to have task state [${idx}]`, () => {
          // given
          const mockCallback = jest.fn((newLine: string) => {})
  
          // when
          taskStateService.addTaskState(line, mockCallback)
  
          // then
          expect(mockCallback.mock.calls[0][0]).toEqual(`${line}[[${firstState}]] `)
        })
      )
    })
  
    describe('when line does not need task state', () => {
      const linesNotToNeedTaskStatus = [
        '-',
        '- [',
        '- []',
        '- [ ]',
        '[ ] ',
        `- [ ] [[${firstState}]]`,
        '- [ ] [[]]'
      ]
  
      linesNotToNeedTaskStatus.forEach((line, idx) => 
        it(`should execute callback with line not to have task state [${idx}]`, () => {
          // given
          const mockCallback = jest.fn((newLine: string) => {})
  
          // when
          taskStateService.addTaskState(line, mockCallback)
  
          // then
          expect(mockCallback.mock.calls).toHaveLength(0)
        })
      )
    })
  })
  
  describe('toggle task state', () => {
    describe('when line needs task state toggled', () => {
      const linesToNeedTaskStateToggled = [
        [`- [ ] [[${firstState}]]`, `- [x] [[${firstState}]]`, firstState, lastState],
        [`- [ ] [[${firstState}]] new task 1`, `- [x] [[${firstState}]] new task 1`, firstState, lastState],
        [`  - [ ] [[${firstState}]]`, `  - [x] [[${firstState}]]`, firstState, lastState],
        [`- [x] [[${lastState}]]`, `- [ ] [[${lastState}]]`, lastState, firstState],
        [`- [x] [[${lastState}]] new task 1`, `- [ ] [[${lastState}]] new task 1`, lastState, firstState],
        [`  - [x] [[${lastState}]]`, `  - [ ] [[${lastState}]]`, lastState, firstState],
        [`- [ ] [[${taskStates[1]}]]`, `- [x] [[${taskStates[1]}]]`, taskStates[1], lastState],
        [`- [x] [[${taskStates[1]}]]`, `- [ ] [[${taskStates[1]}]]`, taskStates[1], firstState],
      ]

      linesToNeedTaskStateToggled.forEach(([removed, line, before, after], idx) => {
        it(`should execute callback with line to have toggled task state [${idx}]`, () => {
          // given
          const mockCallback = jest.fn((newLine: string) => {})

          // when
          taskStateService.toggleTaskState(removed, line, undefined, mockCallback)

          // then
          expect(mockCallback.mock.calls[0][0]).toEqual(line.replace(`[[${before}]]`, `[[${after}]]`))
        })
      })
    })
  })
})