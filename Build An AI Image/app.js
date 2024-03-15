const genarateForm = document.querySelector(".generate-form");
const imagGallary = document.querySelector(".image-gallery");
const OPENAI_API_KEY = "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";
let isImgGenerating = false;

const updateImageCard = (imgDataArray) => {
  imgDataArray.forEach((imgObject, index) => {
    const imgCard = document.querySelectorAll(".image-card")[index];
    const imgElement = imgCard.querySelector("img");
    const downloadBtn = imgCard.querySelector(".download-btn");
    const shareBtn = imgCard.querySelector(".share-btn");

    // set image source to the AI generated image data
    const aiGeneratedImg = `data:image/jpeg;base64,${imgObject.b64_json}`;

    imgElement.src = aiGeneratedImg;

    // remove loader
    imgElement.onload = () => {
      imgCard.classList.remove("loading");
      downloadBtn.setAttribute("href", aiGeneratedImg);
      downloadBtn.setAttribute("download", `${new Date().getTime()}.jpg`);

      // imgCard.classList.remove("loading");
      // downloadBtn.setAttribute("href", aiGeneratedImg);
      // downloadBtn.setAttribute("download", `${new Date().getTime()}.jpg`);

      shareBtn.addEventListener("click", function () {
        if (navigator.share) {
          navigator
            .share({
              title: "AI Generated Image",
              text: "Check out this AI generated image!",
              url: aiGeneratedImg,
            })
            .then(function () {
              console.log("Succeed");
            })
            .catch((error) => {
              console.log("Error sharing: ", error);
            });
        } else {
          alert("Web Share API is not supported on this browser.");
        }
      });
    };
  });
};

const generateAiImage = async (userForm, userImageQuantity) => {
  try {
    const response = await fetch(
      "https://api.openai.com/v1/images/generations",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          prompt: userForm,
          n: parseInt(userImageQuantity),
          size: "512x512",
          response_format: "b64_json",
        }),
      }
    );

    if (!response.ok)
      throw new Error("Failed to generate  images! Please try again.");

    const { data } = await response.json(); //get data from response

    console.log(data);
    updateImageCard([...data]);
  } catch (error) {
    alert(error.message);
  } finally {
    isImgGenerating = false;
  }
};

const handleFormSubmission = (e) => {
  e.preventDefault();
  if (isImgGenerating) return;
  isImgGenerating = true;

  //   get user input and image
  const userForm = e.srcElement[0].value;
  const userImageQuantity = e.srcElement[1].value;

  const imgCardMarkup = Array.from(
    { length: userImageQuantity },
    () =>
      `<div class="image-card loading">
      <img src="image/loader.svg" alt="image" />
      <a href="#" class="download-btn">
        <ion-icon name="download-outline"></ion-icon>
      </a>
      <a href="#" class="share-btn">
        <ion-icon name="share-social-outline"></ion-icon>
      </a>
    </div>
  `
  ).join("");

  imagGallary.innerHTML = imgCardMarkup;

  generateAiImage(userForm, userImageQuantity);
};

genarateForm.addEventListener("submit", handleFormSubmission);
