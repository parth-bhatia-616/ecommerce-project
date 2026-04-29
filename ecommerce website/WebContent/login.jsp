<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Login - eCommerce Store</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div class="form-container">
        <h1>Login</h1>

        <%
            String error = request.getParameter("error");
            if (error != null) {
        %>
            <div class="error-message"><%= error %></div>
        <%
            }
        %>

        <%
            String success = request.getParameter("success");
            if (success != null) {
        %>
            <div class="success-message"><%= success %></div>
        <%
            }
        %>

        <form method="POST" action="login" onsubmit="return validateLogin()">
            <div class="form-group">
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" required>
            </div>

            <div class="form-group">
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" required>
            </div>

            <button type="submit" class="btn">Login</button>
        </form>

        <p class="link-text">Don't have an account? <a href="registration.jsp">Register here</a></p>
    </div>

    <script src="js/script.js"></script>
</body>
</html>
