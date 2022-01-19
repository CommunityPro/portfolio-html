<p align="center">
<img src="https://user-images.githubusercontent.com/62628408/149734737-cd534c5b-03d9-4ad3-af77-70d6784d98cc.png" align="center" width="50%">
</p>


<h1 align="center">Portfolio Template - HTML</h1>

<p align="center">
<img src="https://img.shields.io/github/repo-size/CommunityPro/portfolio-html?color=green&label=project%20size">
<a href="https://github.com/CommunityPro/portfolio-html/issues?q=is%3Aopen+is%3Aissue">
<img src="https://img.shields.io/github/issues-raw/Communitypro/portfolio-html?color=green">
</a>
<a href="https://github.com/CommunityPro/portfolio-html/labels/good%20first%20issue">     
<img src="https://img.shields.io/github/labels/CommunityPro/portfolio-html/good%20first%20issue">
</a>
<a href="https://github.com/CommunityPro/portfolio-html/labels/help%20wanted"> 
<img src="https://img.shields.io/github/labels/CommunityPro/portfolio-html/help%20wanted">
</a>
<a href="https://github.com/CommunityPro/portfolio-html/labels/bug">
<img src="https://img.shields.io/github/labels/Communitypro/portfolio-html/bug">
</a>
<a href="https://github.com/CommunityPro/portfolio-html/labels/enhancement"> 
<img src="https://img.shields.io/github/labels/Communitypro/portfolio-html/enhancement">
</a>       
</p>

<p align="center">Build your portfolio using this super easy template. Free to use if you are a member of the community or a contributor to this project. if not, read our <a href="">requirements</a> if you plan on using this template for your portfolio.</p>

<p align="center">This project is made from the tireless efforts of the community, so feel free to support our work by contributing, staring ✨ the project or <a href="">sponsoring</a> us. 🙏🏽</p>

<p align="center">
<img src="https://forthebadge.com/images/badges/built-by-developers.svg">
<img src="https://forthebadge.com/images/badges/built-with-love.svg">
<img src="https://forthebadge.com/images/badges/ctrl-c-ctrl-v.svg">
<img src="https://forthebadge.com/images/badges/open-source.svg">
</p>

<hr>

<img src="https://user-images.githubusercontent.com/62628408/149736212-e7051d4f-569f-45f4-a7c0-51458316e06d.png" width="100%">

## Design credit: 
- <a href="https://github.com/CommunityPro">Communitypro</a>
- <a href="https://dribbble.com/shots/14385288-Portfolio-Landing-Page?utm_source=Clipboard_Shot&utm_campaign=oguzyagiz&utm_content=Portfolio%3A%20Landing%20Page&utm_medium=Social_Share&utm_source=Clipboard_Shot&utm_campaign=oguzyagiz&utm_content=Portfolio%3A%20Landing%20Page&utm_medium=Social_Share">Dribble Inspiration</a>
- <a href="https://github.com/frankiefab100">Franklin U.O. Ohaegbulam</a>
- <a href="https://openpeeps.com/">Open Peeps Illustration</a> by <a href="https://twitter.com/pablostanley">Pablo Stanley</a> 

## How to Contribute

Are you contributing to this project, please ensure all pull requests and contributions comply with our <a href="https://github.com/CommunityPro/portfolio-html/blob/main/CONTRIBUTING.md">guidelines</a>

Before making any changes, ensure you have raised an issue <a href="https://github.com/CommunityPro/portfolio-html/issues/new/choose">here</a>, unless it is a minimal change like Typo error then you can go right ahead.

## Folder Structure

```bash
├── dist
│   ├── index.html
│   ├── css
│   │   ├── style.css
│   │   ├── global.css
│   ├── assets
│   │   ├── profile-image
│   │   ├── logo
│   ├── js
│   │   ├── script.js
├── .github
│   ├── ISSUE_TEMPLATE
│   │   ├── bug.md
│   │   ├── feature.md
│   ├── Pull_request_template.md
├── CODE_OF_CONDUCT.md
├── CONTRIBUTING.md
├── LICENSE
├── README.md
├── package.json
└── .gitignore
```

<!-- First, fork this repository to your own account. Then use git clone <url> to bring your forked repository down to your local machine (remember to get the URL for your repository, not the original). Optionally, use git remote add upstream <url> to add the original repository as the upstream (this is helpful for keeping your fork up-to-date).
Adding Content

The root homepage is located at index.html. This is where a visitor will land when they visit our URL.

Additional pages should go in the views folder, which will hold all of our HTML files. Styling, as CSS, and scripting, as JS, should go in the public folder. Any images or other media can go in the assets folder.
Claiming an Issue

All of our issues are open to contributors! If you see an open issue you would like to work on, please comment on the issue so we may re-assign it to you.

    NOTE: Assigned issues that have not had any activity in a week will be unassigned.

If an issue is already assigned, please look for another issue to contribute to.We use labels to help categorise issues:

    good first issue - These issues require minimal familiarity with our codebase. Please reserve these for first-time contributors.
    help wanted - These issues are open to any contributors.
    staff only - These issues are locked to project members/collaborators. Pull requests on these issues will not be accepted from outside contributors.

Working on your issue

Before starting work, we highly recommend ensuring that your forked version is up to date. If you set the upstream as mentioned in Setting Up Your Code, run these commands in your terminal (with the terminal pointed at the root directory of your local files):

    git fetch upstream - this gets the current state of the original repo, without pulling down the changes to your local machine.
    git reset --hard upstream/main - this resets the state of your local files to match the current state of the original repo.
    git push -f - this forces the changes to your forked repo (thus making it match the original)

    NOTE: You will lose any changes you are currently working on. Do this with care.

Next, use git checkout -b <branchname> to create a new branch for your work. It's always a good idea to avoid committing changes directly to your main branch - this keeps it clean and avoids errors when updating (above).

Branch names should follow a convention of scope/issue?/description where:

    scope is the nature of the changes (eg. feat for a new feature, or docs for documentation update). This should match the scope of the related issue.
    issue is the number for the related issue you're addressing.
    description is a brief description of your changes, such as update-contribs for updating the contributing guidelines.

Now you are free to work on your code! When you are satisfied with your changes, you can commit them with git commit -s -m "message", where:

    -s flag signs the commit, to verify the connection with your GitHub account.
    -m flag sets up the commit message.
    message is the commit message: a brief (50 character max) message describing what the commit changes.

## Submitting a Pull Request

Once you have all of your changes made and committed, you can push them to your forked repository! Use git push -u origin <branchname>, where:

    -u tells git to set the upstream (see below)
    origin tells git to push to your fork
    branchname tells git to push to a branch - this MUST match the name of the branch you created locally.

    NOTE: By setting the upstream, any subsequent push commands can be done with git push, and it will be pushed to the same branch.

Now you can open the pull request! You should see a quick option to do so appear at the top of your repository on GitHub. Click the "Pull Request" button to have GitHub automatically set up the pull request.

First, change the title of the pull request to match your branch name (following the conventions above!). Then, follow the instructions in the preset Pull Request template (make sure to complete any steps listed!).

Congratulations! You've submitted your first pull request! We will review it as quickly as possible, so keep an eye out for approvals (or requested changes).
Other Contributions

## Additional Info

If you aren't comfortable with the codebase, or would like to contribute in other ways, we have options for that!
Documentation: You are always welcome to update our documentation (like this file!) if you see any typos or anything that can be clarified, raise an issue <a href="">here</a>
Features: If you have ideas for new features or improvements, feel free to open an issue <a href="">here</a>
Bug Reports: We rely on our users to help identify bugs - if you see something wrong, please let us know with an issue!

## Frequently Asked Questions (FAQ) -->

<div align="center">
  <a href="https://www.buymeacoffee.com/evavic44">
    <img width="150px" alt="bmc-button" src="https://user-images.githubusercontent.com/62628408/127788747-8850d386-fc61-4fff-b18f-8c5ee597be34.png">
  </a>
<img width="150px" height="100%" src="https://img.shields.io/badge/sponsor-30363D?style=for-the-badge&logo=GitHub-Sponsors&logoColor=#white">
</div>

If you like this project, kindly star ⭐ and share this project. It means the world to us.
You can also offer support by donating to keep this project going.
