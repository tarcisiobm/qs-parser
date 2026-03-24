# QS Parser

Simple project that converts URL query strings into nested JSON with bracket notation support.
Most query string parsers treat bracket notation as flat keys. This one actually resolves into nested JSON.

**[access here]()**

## Features

- Bracket notation → nested objects: `user[name]=John` → `{"user": {"name": "John"}}`
- URL-encoded brackets
- Arbitrary nesting depth
- Duplicate keys grouped into arrays
- Syntax-highlighted output

## Development

No build step. Open `index.html` or serve locally:

```bash
python3 -m http.server 8000
```
