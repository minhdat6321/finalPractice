const student = document.querySelector("#student");
const listJob = document.querySelector("#listJob");
const preBtn = document.querySelector("#pre");
const nextBtn = document.querySelector("#next");
const searchIcon = document.querySelector("#searchIcon");
const searchInput = document.querySelector("#searchInput");
const cate = document.querySelector("#cate");

let date = new Date();
let url = ``;
let value = 0;
let sortBy = [];

student.innerHTML = `<p>INTERVIEW MODULE 1</p>
<p>Learner name: To Nguyen Minh Dat</p>
<p>Date: ${date}</p>`;

const API_KEY = `https://frcz3-8080.csb.app`;

// get API
const getAPI = async () => {
  try {
    url = `${API_KEY}/jobs?q=${searchInput.value
      .replace(/[^0-9a-zA-Z ]/g, "")
      .trim()}&_limit=10&_start=${0 + value}&_end=${
      10 + value
    }&_sort=${sortBy}`;
    const res = await fetch(url);
    if (res) {
      const data = await res.json();
      return data;
    }
  } catch (error) {
    console.log(`Error: ${error}`);
  }
};

const renderJobs = async () => {
  try {
    const data = await getAPI();
    listJob.innerHTML = ``;
    const ulListJob = document.createElement(`ul`);
    data.forEach(async (job) => {
      const x = document.createElement(`li`);
      x.textContent = `${job.title}`;
      ulListJob.appendChild(x);
    });
    listJob.appendChild(ulListJob);
  } catch (error) {
    console.log(`Error: ${error}`);
  }
};
renderJobs();

// button pre next

nextBtn.addEventListener("click", async () => {
  value += 10;
  preBtn.disabled = false;
  renderJobs();
});
preBtn.addEventListener("click", async () => {
  if (value > 0) {
    value -= 10;
    if (value === 0) preBtn.disabled = true;
  }
  renderJobs();
});

// search Bar

searchInput.addEventListener("keypress", async (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    value = 0;
    preBtn.disabled = true;
    const data = await getAPI();
    if (data.length === 0) {
      listJob.textContent = `SORRYYYYY`;
    } else {
      renderJobs();
    }
  }
});

//cate
const createCate = async () => {
  try {
    const data = await getAPI();
    Object.keys(data[0]).forEach(async (name) => {
      const x = document.createElement(`label`);
      x.setAttribute("for", name);
      x.innerHTML = `<input type="checkbox" id=${name} value=${name} />${name}`;
      cate.appendChild(x);
    });
  } catch (error) {
    console.log(`Error: ${error}`);
  }
};
createCate();

cate.addEventListener("change", (event) => {
  const sortElement = event.target.value;
  if (sortBy.includes(sortElement)) {
    sortBy = sortBy.filter((value) => value !== sortElement);
  } else {
    sortBy.push(sortElement);
  }
  sortBy.join(",");
  console.log(sortBy);
});
