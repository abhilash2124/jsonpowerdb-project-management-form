const connToken = "90935240|-31949236449310285|90958455";

const dbName = "COLLEGE-DB";
const relName = "PROJECT-TABLE";

const jpdbBaseUrl = "http://api.login2explore.com:5577";
const jpdbIML = "/api/iml";
const jpdbIRL = "/api/irl";

$(document).ready(function () {

    resetForm();

    $("#projectId").focusout(function () {
        checkProject();
    });

});

function disableAllFields() {

    $("#projectName").prop("disabled", true);
    $("#assignedTo").prop("disabled", true);
    $("#assignmentDate").prop("disabled", true);
    $("#deadline").prop("disabled", true);

}

function enableAllFields() {

    $("#projectName").prop("disabled", false);
    $("#assignedTo").prop("disabled", false);
    $("#assignmentDate").prop("disabled", false);
    $("#deadline").prop("disabled", false);

}

function resetForm() {

    $("#projectId").val("");
    $("#projectName").val("");
    $("#assignedTo").val("");
    $("#assignmentDate").val("");
    $("#deadline").val("");

    $("#projectId").prop("disabled", false);

    disableAllFields();

    $("#saveBtn").prop("disabled", true);
    $("#updateBtn").prop("disabled", true);
    $("#resetBtn").prop("disabled", true);

    $("#projectId").focus();

}

function validateData() {

    let projectId = $("#projectId").val();
    let projectName = $("#projectName").val();
    let assignedTo = $("#assignedTo").val();
    let assignmentDate = $("#assignmentDate").val();
    let deadline = $("#deadline").val();

    if (projectId === "") {
        alert("Project ID Required");
        return "";
    }

    if (projectName === "") {
        alert("Project Name Required");
        return "";
    }

    if (assignedTo === "") {
        alert("Assigned To Required");
        return "";
    }

    if (assignmentDate === "") {
        alert("Assignment Date Required");
        return "";
    }

    if (deadline === "") {
        alert("Deadline Required");
        return "";
    }

    let jsonObj = {
        projectId: projectId,
        projectName: projectName,
        assignedTo: assignedTo,
        assignmentDate: assignmentDate,
        deadline: deadline
    };

    return JSON.stringify(jsonObj);

}

function checkProject() {

    let projectId = $("#projectId").val();

    if (projectId === "") {
        return;
    }

    let getRequest = createGET_BY_KEYRequest(
        connToken,
        dbName,
        relName,
        JSON.stringify({
            projectId: projectId
        })
    );

    jQuery.ajaxSetup({ async: false });

    let resultObj = executeCommandAtGivenBaseUrl(
        getRequest,
        jpdbBaseUrl,
        jpdbIRL
    );

    jQuery.ajaxSetup({ async: true });

    if (resultObj.status === 400) {

        enableAllFields();

        $("#saveBtn").prop("disabled", false);
        $("#resetBtn").prop("disabled", false);

        $("#projectName").focus();

    }

    else if (resultObj.status === 200) {

        let data = JSON.parse(resultObj.data).record;

        $("#projectName").val(data.projectName);
        $("#assignedTo").val(data.assignedTo);
        $("#assignmentDate").val(data.assignmentDate);
        $("#deadline").val(data.deadline);

        enableAllFields();

        $("#projectId").prop("disabled", true);

        $("#saveBtn").prop("disabled", true);
        $("#updateBtn").prop("disabled", false);
        $("#resetBtn").prop("disabled", false);

        $("#projectName").focus();

    }

}

function saveProject() {

    let jsonStr = validateData();

    if (jsonStr === "") {
        return;
    }

    let putRequest = createPUTRequest(
        connToken,
        jsonStr,
        dbName,
        relName
    );

    jQuery.ajaxSetup({ async: false });

    executeCommandAtGivenBaseUrl(
        putRequest,
        jpdbBaseUrl,
        jpdbIML
    );

    jQuery.ajaxSetup({ async: true });

    alert("Project Saved Successfully");

    resetForm();

}

function updateProject() {

    let jsonStr = validateData();

    if (jsonStr === "") {
        return;
    }

    let updateRequest = createUPDATERecordRequest(
        connToken,
        jsonStr,
        dbName,
        relName,
        JSON.stringify({
            projectId: $("#projectId").val()
        })
    );

    jQuery.ajaxSetup({ async: false });

    executeCommandAtGivenBaseUrl(
        updateRequest,
        jpdbBaseUrl,
        jpdbIML
    );

    jQuery.ajaxSetup({ async: true });

    alert("Project Updated Successfully");

    resetForm();

}