var jpdbBaseURL = "http://api.login2explore.com:5577";
var jpdbIML = "/api/iml";
var jpdbIRL = "/api/irl";
var DBName = "COLLEGE-DB";
var DBRelation = "PROJECT-TABLE";
var connToken = "90938357|-31949272131703389|90951981";

$('#empid').focus();

function saveRecNo2LS(jsonObj){
    var ls = JSON.parse(jsonObj.data).rec_no;
    localStorage.setItem('recno', ls);
}

function getEmpIdAsJsonObj(){
    var projid = $('#projid').val();
    var jsonObj = {
        Project_ID: projid
    };

    return JSON.stringify(jsonObj);
}

function filldata(jsonObj){
    saveRecNo2LS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $('#projname').val(record.Project_Name);
    $('#assignto').val(record.Assigned_To);
    $('#assigndate').val(record.Assignment_Date);
    $('#dline').val(record.Deadline);
}

function resetForm(){
    $('#projid').val("");
    $('#projname').val("");
    $('#assignto').val("");
    $('#assigndate').val("");
    $('#dline').val("");
    $('#projid').prop("disabled", false);
    $('#save').prop("disabled", true);
    $('#change').prop("disabled", true);
    $('#reset').prop("disabled", true);
    $('#projid').focus();
}

function validateData(){
    projid=$('#projid').val();
    projname=$('#projname').val();
    assignto=$('#assignto').val();
    assigndate=$('#assigndate').val();
    dline=$('#dline').val();

    if(projid===""){
        alert("Project-ID missing");
        $('#projid').focus();
        return "";
    }
    if(projname===""){
        alert("Project-Name missing");
        $('#emprojnamepname').focus();
        return "";
    }
    if(assignto===""){
        alert("Assigned-To missing");
        $('#assignto').focus();
        return "";
    }
    if(assigndate===""){
        alert("Assignment-Date missing");
        $('#assigndate').focus();
        return "";
    }
    if(dline===""){
        alert("Deadline missing");
        $('#dline').focus();
        return "";
    }

    var jsonStrObj = {
        Project_ID: projid,
        Project_Name: projname,
        Assigned_To: assignto,
        Assignment_Date: assigndate,
        Deadline: dline,
    }
    return JSON.stringify(jsonStrObj);
}

function getEmp(){
    var projIDJsonObj = getEmpIdAsJsonObj();
    var getrequest = createGET_BY_KEYRequest(connToken, DBName, DBRelation, projIDJsonObj);
    jQuery.ajaxSetup({ async: false });
    var resultObj = executeCommandAtGivenBaseUrl(getrequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({ async: true });

    if(resultObj.status === 400){
        $('#save').prop("disabled", false);
        $('#reset').prop("disabled", false);
        $('#projname').focus();
    }
    else if(resultObj.status === 200){
        $('#projid').prop("disabled", true);
        filldata(resultObj);
        $('#change').prop("disabled", false);
        $('#reset').prop("disabled", false);
        $('#projname').focus();
    }
}

function saveData(){
    var jsonStrObj = validateData();
    if(jsonStrObj ===""){
        return "";
    }
    var putReqStr = createPUTRequest(connToken,jsonStrObj, DBName, DBRelation);

    alert(putReqStr);
    jQuery.ajaxSetup({ async: false });
    var resultObj = executeCommandAtGivenBaseUrl(putReqStr, jpdbBaseURL, jpdbIML);
    alert(JSON.stringify(resultObj));
    jQuery.ajaxSetup({ async: true });
    resetForm();
}

function changeData(){
    var jsonStrObj = validateData();
    if(jsonStrObj ===""){
        return "";
    }
    var updateRequest = createUPDATERecordRequest(connToken,jsonStrObj,DBName,DBRelation,localStorage.getItem('recno'));
    jQuery.ajaxSetup({ async: false });
    var resultObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
    alert(JSON.stringify(resultObj));
    jQuery.ajaxSetup({ async: true });
    resetForm();
}

