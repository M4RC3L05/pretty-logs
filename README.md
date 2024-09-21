# Pretty logs

Pretty format json logs

## Usage

### Deno

Just pipe to the package bin export:

```cmd
foo | deno run --no-lock jsr:@m4rc3l05/pretty-logs/bin
```

### Bun/NodeJS

Create a script ex: ./pretty:

```js
#!/usr/bin/env <bun/node>

import { pretty, resolveRuntime, runtime } from "@m4rc3l05/pretty-logs";

await pretty(resolveRuntime(runtime()));
```

Make it executable and pipe to that script:

```cmd
foo | ./pretty
```
