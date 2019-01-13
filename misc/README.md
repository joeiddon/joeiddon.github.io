This folder contains any random files that are not pages and are directory independent.

E.g. it contains a file with links to all the pages for google search indexing.

```find . -not -path "./.git*" -not -path "./_layouts*" | cut -b 2- | while read l; do echo https://joeiddon.github.io$l; done > misc/gsearchlinks.html```
