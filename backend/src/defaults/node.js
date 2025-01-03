
export const basePrompt2 = '<boltArtifact id=\"project-import\" title=\"Project Files\"><boltAction type=\"file\" filePath=\"index.js\">// run `node index.js` in the terminal\n\nconsole.log(`Hello Node.js v${process.versions.node}!`);\n</boltAction><boltAction type=\"file\" filePath=\"package.json\">{\n  \"name\": \"node-starter\",\n  \"private\": true,\n  \"scripts\": {\n    \"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\n  }\n}\n</boltAction></boltArtifact>';


export const basePrompt={
  "id": "project-import",
  "title": "Project Files",
  "actions": [
    {
      "type": "file",
      "filePath": "index.js",
      "content": "// run `node index.js` in the terminal\n\nconsole.log(`Hello Node.js v${process.versions.node}!`);"
    },
    {
      "type": "file",
      "filePath": "package.json",
      "content": "{\n  \"name\": \"node-starter\",\n  \"private\": true,\n  \"scripts\": {\n    \"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\n  }\n}"
    }
  ]
}
