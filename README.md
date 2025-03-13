modules = ["nodejs-20"]

[nix]
channel = "stable-24_05"

[workflows]
runButton = "Project"

[[workflows.workflow]]
name = "Project"
mode = "parallel"
author = "agent"

[[workflows.workflow.tasks]]
task = "workflow.run"
args = "KidLearn App"

[[workflows.workflow]]
name = "KidLearn App"
author = "agent"

[workflows.workflow.metadata]
agentRequireRestartOnSave = false

[[workflows.workflow.tasks]]
task = "packager.installForAll"

[[workflows.workflow.tasks]]
task = "shell.exec"
args = "cd server && npm install && node index.js & cd client && npm install && npx parcel build index.html && npx parcel serve index.html --port 5000 --no-cache"
waitForPort = 5000

[deployment]
run = ["sh", "-c", "cd server && npm install && node index.js & cd client && npm install && npx parcel build index.html && npx parcel serve index.html --port 5000 --no-cache"]

[[ports]]
localPort = 5000
externalPort = 5000

[[ports]]
localPort = 8000
externalPort = 80
