const student = document.querySelector("#student");
const listJob = document.querySelector("#listJob");
const nextBtn = document.querySelector("#next");
const preBtn = document.querySelector("#pre");
const searchInput = document.querySelector("#searchInput");
const searchIcon = document.querySelector("#searchIcon");
const cate = document.querySelector("#cate");
let sortBy = [];
let date = new Date();
let url = ``;
let value = 0;

student.innerHTML = `<p>Practice Module 1 CODERSCHOOL</p>
<p>Learner name: To Nguyen Minh Dat</p>
<p>Date: ${date}</p>`;

// API collect data
const API_KEY = `https://frcz3-8080.csb.app`;

const getAPI = async () => {
  try {
    url = `${API_KEY}/jobs?q=${searchInput.value
      .replace(/[^0-9a-zA-Z ]/g, "")
      .trim()}&_start=${0 + value}&_end=${
      10 + value
    }&_limit=10&_sort=${sortBy.join(",")}`;
    const res = await fetch(url);
    if (res) {
      const data = await res.json();
      return data;
    }
  } catch (error) {
    console.log(`Error: ${error}`);
  }
};
// getAPI().then((result) => console.log(result));

const renderJobs = async () => {
  try {
    const data = await getAPI();
    listJob.innerHTML = ``;
    const ulListJob = document.createElement(`ul`);
    data.forEach((job) => {
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

//button next pre

nextBtn.addEventListener("click", async () => {
  value += 10;
  renderJobs();
  preBtn.disabled = false;
});
preBtn.addEventListener("click", async () => {
  if (value > 0) {
    value -= 10;
    renderJobs();
    if (value === 0) preBtn.disabled = true;
  }
});

//searchBar
searchInput.addEventListener("keypress", async (event) => {
  const data = await getAPI();
  if (event.key === "Enter") {
    value = 0;
    preBtn.disabled = true;
    if (data.length === 0) {
      listJob.textContent = `SORRY`;
    } else {
      renderJobs();
    }
  }
});
searchIcon.addEventListener("click", async () => {
  const data = await getAPI();

  value = 0;
  preBtn.disabled = true;
  if (data.length === 0) {
    listJob.textContent = `SORRY`;
  } else {
    renderJobs();
  }
});

//cate
const getListCate = async () => {
  try {
    const data = await getAPI();
    Object.keys(data[0]).forEach(async (name) => {
      const x = document.createElement(`label`);
      x.setAttribute = (`for`, name);
      x.innerHTML = `<input type="checkbox" value=${name} id=${name}/>${name}`;
      cate.appendChild(x);
    });
  } catch (error) {
    console.log(`Error: ${error}`);
  }
};
getListCate();

//checkedbox
cate.addEventListener("change", async (event) => {
  const sortElement = event.target.value;
  sortBy.push(sortElement);
  renderJobs();
});
