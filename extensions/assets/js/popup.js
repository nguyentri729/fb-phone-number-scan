const baseURL = "http://localhost:4000";

if (localStorage.getItem("access_token")) window.location = "/profile.html";
$("#login-form").submit((e) => {
  console.log(e);
  const email = $("#email").val().trim();
  const password = $("#password").val().trim();
  $("#btn-submit").attr("disabled", true);
  e.preventDefault();

  $.post(`${baseURL}/login`, { email, password }, (res) => {
    const {accessToken, refreshToken} = res
    if (accessToken && refreshToken) {
        localStorage.setItem("access_token", accessToken)
        localStorage.setItem("refresh_token", refreshToken)
        window.location = "/profile.html"
    }
  })
    .fail(function (err) {
      $("#text-login-msg").html(`⛔ ${err.responseJSON.msg || "Unknown"}`);
    })
    .always(function () {
      $("#btn-submit").attr("disabled", false);
    });
});
