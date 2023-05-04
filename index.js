const renderTable = (data) => {
  const tbody = document.querySelector("#tbody");
  tbody.innerHTML = "";
  data.forEach(({ id, name, salary, date }, index) => {
    tbody.innerHTML += `
      <tr>
        <td><input type="checkbox" id=${id} /></td>
        <td>${index + 1}</td>
        <td>${name}</td>
        <td>${salary}</td>
        <td>${date}</td>
      <tr>`;
  });
};

const sortData = (event, data, sortBy) => {
  event.target.classList.toggle("active");
  const isActive = event.target.classList.contains("active");

  if (sortBy === "salary") {
    isActive
      ? data.sort((a, b) => +b.salary - +a.salary)
      : data.sort((a, b) => +a.salary - +b.salary);
  } else if (sortBy === "date") {
    isActive
      ? data.sort((a, b) => new Date(b.date) - new Date(a.date))
      : data.sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  renderTable(data);
};

const openModal = () => {
  const modal = document.querySelector(".modal");
  modal.style.display = "block";
};

const closeModal = () => {
  const modal = document.querySelector(".modal");
  modal.style.display = "none";
};

const getModalElements = () => {
  const name = document.querySelector("#edit-name");
  const salary = document.querySelector("#edit-salary");
  const date = document.querySelector("#edit-date");

  // return { name: name, salary: salary, date: date };
  return { name, salary, date };
};

const addUser = (event, data) => {
  event.preventDefault();
  // const userForm = document.querySelector("#user-form");
  const name = document.querySelector("#name").value;
  const salary = document.querySelector("#salary").value;
  const date = document.querySelector("#date").value;

  data.push({ id: Date.now(), name, salary, date });
  localStorage.setItem("data", JSON.stringify(data));

  renderTable(data);
};

const deleteUsers = (data) => {
  const checkedCheckboxes = [
    ...document.querySelectorAll("input[type=checkbox]:checked"),
  ];

  const ids = checkedCheckboxes.map((item) => {
    return +item.id;
  });
  const newData = data.filter((user) => !ids.includes(user.id));
  renderTable(newData);
};

const deleteAllUsers = (data) => {
  data = [];
  renderTable(data);
};

const openModalWithUserData = (data) => {
  const checkedCheckboxes = [
    ...document.querySelectorAll("input[type=checkbox]:checked"),
  ];

  if (checkedCheckboxes.length === 1) {
    openModal();
    const { name, salary, date } = getModalElements();
    const user = data.find((user) => user.id === +checkedCheckboxes[0].id);

    name.value = user.name;
    salary.value = user.salary;
    date.value = user.date;
  } else {
    alert("Please select only one user to edit");
  }
};

const confirmEditing = (event, data) => {
  event.preventDefault();
  const checkbox = document.querySelector("input[type=checkbox]:checked");
  const userIndex = data.findIndex((user) => user.id === +checkbox.id);
  const { name, salary, date } = getModalElements();

  data.splice(userIndex, 1, {
    id: +checkbox.id,
    name: name.value,
    salary: salary.value,
    date: date.value,
  });

  closeModal();
  renderTable(data);
};

const init = () => {
  let data = JSON.parse(localStorage.getItem("data")) || [];
  renderTable(data);

  const submitButton = document.querySelector("#submit");
  const deleteButton = document.querySelector("#delete");
  const deleteAllButton = document.querySelector("#delete-all");
  const editButton = document.querySelector("#edit");
  const editSubmitButton = document.querySelector("#edit-submit");
  const salaryFilter = document.querySelector("#salary-filter");
  const dateFilter = document.querySelector("#date-filter");

  submitButton.addEventListener("click", (event) => {
    addUser(event, data);
  });

  deleteButton.addEventListener("click", () => {
    deleteUsers(data);
  });

  deleteAllButton.addEventListener("click", () => {
    deleteAllUsers(data);
  });

  editButton.addEventListener("click", () => {
    openModalWithUserData(data);
  });

  editSubmitButton.addEventListener("click", (event) => {
    confirmEditing(event, data);
  });

  salaryFilter.addEventListener("click", (event) => {
    sortData(event, data, "salary");
  });

  dateFilter.addEventListener("click", (event) => {
    sortData(event, data, "date");
  });
};

init();
