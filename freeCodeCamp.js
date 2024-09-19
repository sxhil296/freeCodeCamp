import puppeteer from "puppeteer";
import fs from "fs";
const url = "https://www.freecodecamp.org/";
import connectDB from "./db/index.db.js";
import FreeCodeCamp from "./models/freeCodeCamp.model.js";

const getSeoData = async () => {
  await connectDB();
  try {
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      devtools: true,
    });
    const page = await browser.newPage();
    await page.goto(url, {
      waitUntil: "networkidle2",
    });


    //select and scrap metaData
    const metaData = await page.evaluate(() => {
      const description =
        document
          .querySelector('meta[name="description"]')
          ?.getAttribute("content") || "No Description";
      const title = document.querySelector("title")?.textContent || "No Title";
      const keywords =
        document
          .querySelector('meta[name="keywords"]')
          ?.getAttribute("content") || "No Keywords";

      // Select and map links
      const links = Array.from(document.querySelectorAll("a")).map((link) => ({
        text: link.innerText.trim(),
        href: link.href,
      }));

      const linkCount = links.length;

      //select and map images
      const images = Array.from(document.querySelectorAll("img")).map(
        (image) => ({
          imgAlt: image.alt.trim(),
          imgSrc: image.src,
        })
      );

      const imageCount = images.length;

      return {
        title,
        description,
        keywords,
        linkCount,
        links,
        imageCount,
        images,
      };
    });

    //write to file
    fs.writeFileSync("./tempFiles/freeCodeCamp.json", JSON.stringify(metaData));

    // Save to MongoDB with upsert
    const { title, ...data } = metaData;
    await FreeCodeCamp.findOneAndUpdate(
      { title }, // Filter by unique field
      data, // Data to update
      { upsert: true, new: true } // Create new if not exists, return the updated document
    );
    console.log("Data saved or updated in MongoDB:", metaData);

    //console log the data
    console.log(metaData);

    await browser.close();
  } catch (error) {
    console.log(error);
  }
};

getSeoData();
