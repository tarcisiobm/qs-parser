# QS Parser

Simple project that converts URL query strings into nested JSON with bracket notation support.
Most query string parsers treat bracket notation as flat keys. This one actually resolves into nested JSON.

**[access here](https://tarcisio.github.io/qs-parser/)**

## Features

- Bracket notation → nested objects: `user[name]=John` → `{"user": {"name": "John"}}`
- URL-encoded brackets
- Arbitrary nesting depth
- Duplicate keys grouped into arrays
- Syntax-highlighted output
