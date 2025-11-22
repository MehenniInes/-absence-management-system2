/* ====== Attendance ====== */
function updateAttendance() {
    const rows = document.querySelectorAll("#attendanceTable tr");
    rows.forEach(row => {
        const absenceCell = row.querySelector(".absence-count");
        if (!absenceCell) return; // تخطي الصفوف بدون خلايا الحضور

        let absences = 0;
        let participation = 0;

        row.querySelectorAll(".attendance").forEach(cb => {
            if (!cb.checked) absences++;
        });
        row.querySelectorAll(".participation").forEach(cb => {
            if (cb.checked) participation++;
        });

        // تحديث الأعمدة
        absenceCell.textContent = absences;
        row.querySelector(".participation-count").textContent = participation;

        // تلوين الصف حسب الغيابات
        if (absences < 3) row.style.backgroundColor = 'lightgreen';
        else if (absences <= 4) row.style.backgroundColor = 'yellow';
        else row.style.backgroundColor = 'lightcoral';

        // تحديث الرسالة
        let msg = '';
        if (absences >= 5) msg = 'Excluded – too many absences – You need to participate more';
        else if (absences >= 3) msg = 'Warning – attendance low – You need to participate more';
        else msg = 'Good attendance – Excellent participation';
        row.querySelector(".message").textContent = msg;
    });
}

// تفعيل التحديث عند تغيير أي checkbox موجود
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".attendance, .participation").forEach(cb => {
        cb.addEventListener("change", updateAttendance);
    });

    // تلوين الصفوف عند التحميل الأول
    updateAttendance();
});

/* ====== Form Validation & Add Student ====== */
const form = document.getElementById("studentForm");
const table = document.getElementById("attendanceTable");

form.addEventListener("submit", function(e) {
    e.preventDefault();

    const studentID = document.getElementById("studentId").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const firstName = document.getElementById("firstName").value.trim();
    const email = document.getElementById("email").value.trim();

    // مسح رسائل الأخطاء السابقة
    document.getElementById("studentIdError").textContent = "";
    document.getElementById("lastNameError").textContent = "";
    document.getElementById("firstNameError").textContent = "";
    document.getElementById("emailError").textContent = "";
    document.getElementById("formMessage").textContent = "";

    let isValid = true;

    if (studentID === "" || !/^\d+$/.test(studentID)) {
        document.getElementById("studentIdError").textContent = "Student ID must be numbers and cannot be empty.";
        isValid = false;
    }
    if (lastName === "" || !/^[A-Za-z]+$/.test(lastName)) {
        document.getElementById("lastNameError").textContent = "Last Name must contain letters only.";
        isValid = false;
    }
    if (firstName === "" || !/^[A-Za-z]+$/.test(firstName)) {
        document.getElementById("firstNameError").textContent = "First Name must contain letters only.";
        isValid = false;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        document.getElementById("emailError").textContent = "Email must be valid.";
        isValid = false;
    }
     if (!isValid) {
        document.getElementById("formMessage").textContent = "Please fix errors before submitting.";
        return;
    }
    // إنشاء صف جديد
    const newRow = table.insertRow(-1);
    newRow.insertCell(0).textContent = lastName;
    newRow.insertCell(1).textContent = firstName;

    for (let i = 0; i < 6; i++) {
        const aCell = newRow.insertCell(-1);
        const aChk = document.createElement("input");
        aChk.type = "checkbox"; aChk.className = "attendance";
        aChk.addEventListener("change", updateAttendance);
        aCell.appendChild(aChk);

        const pCell = newRow.insertCell(-1);
        const pChk = document.createElement("input");
        pChk.type = "checkbox"; pChk.className = "participation";
        pChk.addEventListener("change", updateAttendance);
        pCell.appendChild(pChk);
    }

    const absCell = newRow.insertCell(-1);
    absCell.className = "absence-count"; absCell.textContent = "0";

    const partCell = newRow.insertCell(-1);
    partCell.className = "participation-count"; partCell.textContent = "0";

    const msgCell = newRow.insertCell(-1);
    msgCell.className = "message"; msgCell.textContent = "";

    // تحديث التلوين والعد فورًا
    updateAttendance();

    document.getElementById("formMessage").textContent = "Student added successfully!";
    form.reset();
});
// ===== Show Report =====
document.getElementById("showReportBtn").addEventListener("click", function() {
    const rows = document.querySelectorAll("#attendanceTable tr");
    let total = 0;
    let present = 0;
    let participated = 0;

    rows.forEach(row => {
        const absenceCell = row.querySelector(".absence-count");
        if (!absenceCell) return;

        total++;
        const absences = parseInt(absenceCell.textContent);
        const participation = parseInt(row.querySelector(".participation-count").textContent);

        if (absences < 6) present++;
        if (participation > 0) participated++;
    });

    document.getElementById("totalStudents").textContent = total;
    document.getElementById("studentsPresent").textContent = present;
    document.getElementById("studentsParticipated").textContent = participated;

    // Get the context of the canvas **here**
    const ctx = document.getElementById('reportChart').getContext('2d');

    // Destroy previous chart if it exists
    if (window.reportChart instanceof Chart) {
    window.reportChart.destroy();
}
 window.reportChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Total Students', 'Present', 'Participated'],
            datasets: [{
                label: 'Attendance Report',
                data: [total, present, participated],
                backgroundColor: ['lightblue', 'lightgreen', 'yellow']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                title: { display: true, text: 'Attendance Summary' }
            }
        }
    });
});
$(document).ready(function() {

    // ===== Hover highlight =====
    $("#attendanceTable").on("mouseenter", "tr", function() {
        $(this).data("origColor", $(this).css("background-color"));
        $(this).css("background-color", "#f2f2f2");
    });

    $("#attendanceTable").on("mouseleave", "tr", function() {
        $(this).css("background-color", $(this).data("origColor"));
    });

    // ===== Row click = show student info =====
    $("#attendanceTable").on("click", "tr", function() {
        const last = $(this).find("td").eq(0).text();
        const first = $(this).find("td").eq(1).text();
        const abs = $(this).find(".absence-count").text();

        // Skip header row
        if (last && first && abs) {
            alert("Student: " + first + " " + last + "\nAbsences: " + abs);
        }
    });

    // ===== Prevent checkbox click from triggering row click =====
    $("#attendanceTable").on("click", ".attendance, .participation", function(e) {
        e.stopPropagation();
    });

});
$(document).ready(function() {

    let highlightInterval; // to store the interval ID

    // ===== Highlight Excellent Students continuously =====
    $("#highlightExcellent").click(function() {
        // Clear any previous interval first
        clearInterval(highlightInterval);

        highlightInterval = setInterval(function() {
            $("#attendanceTable tr").each(function() {
                const absences = parseInt($(this).find(".absence-count").text());
                if (!isNaN(absences) && absences < 3) {
                    $(this).fadeOut(300).fadeIn(300);
                }
            });
        }, 600); // loop every 600ms
    });

    // ===== Reset Colors / Stop Highlight =====
    $("#resetColors").click(function() {
        clearInterval(highlightInterval); // stop the interval
        $("#attendanceTable tr").each(function() {
            $(this).stop(true, true).show(); // stop ongoing fade animations
        });
    });

});


