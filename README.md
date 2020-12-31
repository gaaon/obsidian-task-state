## Obsidian Task State Notes

With Obsidian Task State Notes, each task will be managed along with state note.

### example 

If you add new task with empty bracket by hitting `cmd + enter`, plugin will automatically link state page.

```yml
- [ ] # after hitting cmd + enter
```

->

```yml
- [ ] [[TODO]] # [[TODO]] automatically added
```

Fill task content whatever you want. After completing the task, you just enter `cmd + enter` again.

```yml
- [x] [[TODO]] new task to do # after hitting cmd + enter
```

->

```yml
- [x] [[DONE]] new task to do # [[DONE]] automatically changed
```

It's over. Happy obsidian.