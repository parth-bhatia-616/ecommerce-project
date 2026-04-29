<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="java.sql.*" %>
<%
    // Check if user is logged in
    Integer user_id = (Integer) session.getAttribute("user_id");
    if (user_id == null) {
        response.sendRedirect("login.jsp?error=Please login first");
        return;
    }

    double totalPrice = 0;
    int itemCount = 0;
%>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Cart - eCommerce Store</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div class="header">
        <h1>eCommerce Store</h1>
        <div class="header-right">
            <span>Welcome, <%= session.getAttribute("name") %></span>
            <a href="home.jsp" class="btn-small">Home</a>
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

        <h2>Your Cart</h2>

        <table class="cart-table">
            <thead>
                <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                <%
                    try {
                        Connection conn = DBConnection.getConnection();
                        String query = "SELECT c.cart_id, p.product_name, p.price, c.quantity FROM cart c JOIN products p ON c.product_id = p.product_id WHERE c.user_id = ?";
                        PreparedStatement stmt = conn.prepareStatement(query);
                        stmt.setInt(1, user_id);
                        ResultSet rs = stmt.executeQuery();

                        boolean hasItems = false;
                        while (rs.next()) {
                            hasItems = true;
                            int cartId = rs.getInt("cart_id");
                            String productName = rs.getString("product_name");
                            double price = rs.getDouble("price");
                            int quantity = rs.getInt("quantity");
                            double subtotal = price * quantity;

                            totalPrice += subtotal;
                            itemCount++;
                %>
                    <tr>
                        <td><%= productName %></td>
                        <td>₹<%= String.format("%.2f", price) %></td>
                        <td><%= quantity %></td>
                        <td>₹<%= String.format("%.2f", subtotal) %></td>
                        <td>
                            <form method="POST" action="removeFromCart.jsp" style="display:inline;">
                                <input type="hidden" name="cart_id" value="<%= cartId %>">
                                <button type="submit" class="btn-remove" onclick="return confirm('Remove this item?')">Remove</button>
                            </form>
                        </td>
                    </tr>
                <%
                        }
                        rs.close();
                        stmt.close();
                        conn.close();

                        if (!hasItems) {
                %>
                    <tr>
                        <td colspan="5" style="text-align:center;">Your cart is empty.</td>
                    </tr>
                <%
                        }
                    } catch (Exception e) {
                        System.out.println("Error fetching cart: " + e.getMessage());
                    }
                %>
            </tbody>
            <tfoot>
                <tr class="total-row">
                    <td colspan="3">Total</td>
                    <td>₹<%= String.format("%.2f", totalPrice) %></td>
                    <td></td>
                </tr>
            </tfoot>
        </table>

        <div class="cart-actions">
            <a href="home.jsp">Continue Shopping</a>
            <button onclick="alert('Checkout feature coming soon!')">Proceed to Checkout</button>
        </div>
    </div>
</body>
</html>
