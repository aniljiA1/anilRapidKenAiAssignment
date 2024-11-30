document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.getElementById("menu-toggle");
    const navMenu = document.querySelector(".nav-menu");
    const form = document.getElementById("employee-form");
    const employeeList = document.getElementById("employee-list");
    const searchBar = document.getElementById("search-bar");
    const pages = document.querySelectorAll(".page");
    let employees = JSON.parse(localStorage.getItem("employees")) || [];
    const itemsPerPage = 5;
    let currentPage = 1;
    const showPage = (hash) => {
        pages.forEach((page) => page.classList.remove("active"));
        document.querySelector(hash || "#registration").classList.add("active");
    };
    showPage(window.location.hash);
    menuToggle.addEventListener("click", () => {
        navMenu.classList.toggle("show");
    });
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const newEmployee = {
            name: form.name.value,
            position: form.position.value,
            about: form.about.value,
            joining_date: form.joining_date.value,
        };
        employees.push(newEmployee);
        localStorage.setItem("employees", JSON.stringify(employees));
        form.reset();
        window.location.hash = "#listing";
        renderEmployeeList();
    });
    const renderEmployeeList = () => {
        const filteredEmployees = employees.filter((e) =>
            e.name.toLowerCase().includes(searchBar.value.toLowerCase())
        );
        const paginatedEmployees = filteredEmployees.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
        );
        employeeList.innerHTML = paginatedEmployees
            .map(
                (employee, index) => `
        <tr>
          <td>${employee.name}</td>
          <td>${employee.position}</td>
          <td>${employee.about}</td>
          <td>${employee.joining_date}</td>
          <td><button data-index="${index}" class="delete-btn">Delete</button></td>
        </tr>`
            )
            .join("");
        renderPagination(filteredEmployees.length);
    };
    const renderPagination = (totalItems) => {
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        const paginationControls = document.getElementById("pagination-controls");
        paginationControls.innerHTML = Array.from({
            length: totalPages
        }, (_, i) => {
            const page = i + 1;
            return `<button class="pagination-btn" data-page="${page}">${page}</button>`;
        }).join("");
    };
    employeeList.addEventListener("click", (e) => {
        if (e.target.classList.contains("delete-btn")) {
            const index = e.target.getAttribute("data-index");
            employees.splice(index, 1);
            localStorage.setItem("employees", JSON.stringify(employees));
            renderEmployeeList();
        }
    });
    searchBar.addEventListener("input", renderEmployeeList);
    document.getElementById("pagination-controls").addEventListener("click", (e) => {
        if (e.target.classList.contains("pagination-btn")) {
            currentPage = Number(e.target.getAttribute("data-page"));
            renderEmployeeList();
        }
    });

    window.addEventListener("hashchange", () => showPage(window.location.hash));

    renderEmployeeList();
});