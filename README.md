## Obsidian Task State

With Obsidian Task State, each task will be managed along with state note.

### Usage Example 

If you add new task with empty bracket by hitting `cmd + enter`, plugin will automatically link state page.

```yml
- [ ] # after hitting cmd + enter
```

->

```yml
- [ ] [[TODO]] # automatically add [[TODO]]
```

Fill task content whatever you want. After completing the task, you just enter `cmd + enter` again.

```yml
- [x] [[TODO]] new task to do # after hitting cmd + enter
```

->

```yml
- [x] [[DONE]] new task to do # automatically change [[TODO]] to [[DONE]]
```

### How to install

1. Build the project.

```shell
npm install
npm run build
```

2. Copy over `main.js`, `styles.css`, `manifest.json` to your vault `<vault-path>/.obsidian/plugins/task-state`.

### Roadmap

- [ ] Sync checkbox with task state in preview mode (If click task checkbox in preview mode, task state also changed)
- [ ] Customize todo, done task name
- [ ] Support backlink display text (ex. `[[TODO|❗]]` will display ❗instead of `TODO` in preview mode)

### Support
[Karrot](https://uk.karrotmarket.com)



It's over. Happy obsidian.
