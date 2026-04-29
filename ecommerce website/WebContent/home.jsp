<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="java.sql.*" %>
<%
    // Check if user is logged in
    Integer user_id = (Integer) session.getAttribute("user_id");
    if (user_id == null) {
        response.sendRedirect("login.jsp?error=Please login first");
        return;
    }

    // Get cart count
    int itemCount = 0;
    try {
        Connection conn = DBConnection.getConnection();
        String countSql = "SELECT COUNT(*) FROM cart WHERE user_id = ?";
        PreparedStatement countStmt = conn.prepareStatement(countSql);
        countStmt.setInt(1, user_id);
        ResultSet rs = countStmt.executeQuery();
        if (rs.next()) {
            itemCount = rs.getInt(1);
        }
        rs.close();
        countStmt.close();
        conn.close();
    } catch (Exception e) {
        System.out.println("Error getting cart count: " + e.getMessage());
    }
%>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Home - eCommerce Store</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div class="header">
        <h1>eCommerce Store</h1>
        <div class="header-right">
            <span>Welcome, <%= session.getAttribute("name") %></span>
            <a href="cart.jsp" class="cart-icon">
                🛒 Cart
                <% if (itemCount > 0) { %>
                    <span class="cart-count"><%= itemCount %></span>
                <% } %>
            </a>
            <a href="logout" class="btn-small logout">Logout</a>
        </div>
    </div>

    <div class="container">
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

        <h2>Products</h2>

        <div class="products-grid">
            <%
                try {
                    Connection conn = DBConnection.getConnection();
                    String query = "SELECT product_id, product_name, price FROM products";
                    PreparedStatement stmt = conn.prepareStatement(query);
                    ResultSet rs = stmt.executeQuery();

                    while (rs.next()) {
                        int productId = rs.getInt("product_id");
                        String productName = rs.getString("product_name");
                        double price = rs.getDouble("price");
            %>
                <div class="product-card">
                    <div class="product-name"><%= productName %></div>
                    <div class="product-price">₹<%= String.format("%.2f", price) %></div>
                    <form method="POST" action="addToCart" style="display:inline;">
                        <input type="hidden" name="product_id" value="<%= productId %>">
                        <button type="submit" class="btn">Add to Cart</button>
                    </form>
                </div>
            <%
                    }
                    rs.close();
                    stmt.close();
                    conn.close();
                } catch (Exception e) {
                    System.out.println("Error fetching products: " + e.getMessage());
                }
            %>
        </div>
    </div>
</body>
</html>
