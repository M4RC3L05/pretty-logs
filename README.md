# Pretty logs

Pretty format json logs

## Usage

JSR does not currently suport export bin so:

Create a script example: ./pretty:

```js
#!/usr/bin/env <bun/deno/node>

import { pretty, resolveRuntime, runtime } from "@m4rc3l05/pretty-logs";

if (import.meta.main) {
  await pretty(resolveRuntime(runtime()));
}
```

Make it executable and pipe to that script:

```cmd
foo | ./pretty
```
