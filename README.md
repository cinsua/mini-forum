# TEST
test some services
first commit

For fpiazza:
install git

######################   
working directory       | git add files
######################  v
stagging                    | git commit
######################      v
local repository                | git push remoterepo      
######################          v               ^
remote repo                                     | git pull remoterepo
######################

opt1: create git init and PULL repo(with all files in remote repo) into it
inside proyect folder exec 'git init'
git pull https://github.com/cinsua/TEST.git

opt2:
git clone https://github.com/cinsua/TEST.git (this create a separate folder.. use outside from coder.com)

then:
add files or modify files
git status: gives u a list of non saves changes
you can add to  manually each file with:
git add file.extension
or you can add all with
git add .

git diff file: gives you a list of lines changes on terminal

git commit -m "comment for commit"

Pull changes on to github
first time:
  git config --global user.email "you@example.com"
  git config --global user.name "Your Name"

  git push --set-upstream https://github.com/cinsua/TEST.git master

loggin with github acc

after all this next pull with just:
  git push

.gitignore
here put all folders and files to ignore by git.. example node_modules
