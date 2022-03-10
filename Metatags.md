# How to generate metatags for your website.

## What are Metatags?
Metatags are tags/elements that describe the content of your website, invariably providing metadata/information for search engines.
You place them within the `<head>` tag above the `<link>` tags.

https://metatags.io makes it easy for one to generate these `metatags`.
In the top-right section, the three highlighted channels (Google, Facebook and Twitter) are most recommended.

![metags1](https://user-images.githubusercontent.com/46662771/157324276-b3177058-0a00-45af-82ff-6d3d518fd23f.jpg)

Enter the `title` and `description` of your website or project.
At the left, Check how your website looks like when the link is searched on Google or how it appears when shared on Facebook or Twitter.
See Screenshot for example.

![metatags2](https://user-images.githubusercontent.com/46662771/157324359-85c2dc95-97e7-4838-8597-4b90e5734d6e.JPG)
Then, click `Generate Meta Tags`

![metatag generated](https://user-images.githubusercontent.com/46662771/157324943-7fe07bbb-1d5d-46fd-a9a8-0fb52d1c472d.JPG)
Copy the code into the `<head>` tag of your `html` file.

For the preview image, upload your project image on github, cloudinary, google drive or any online storage. Copy the image url into `content` attribute of <meta> tags with `property="og:image"`.

#### You are good to go!
