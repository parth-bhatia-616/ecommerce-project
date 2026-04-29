<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="java.sql.*" %>
<%@ page import="servlets.DBConnection" %>
<%
    // Check if user is logged in
    Integer user_id = (Integer) session.getAttribute("user_id");
    
    if (user_id == null) {
        response.sendRedirect("login.jsp?error=Please login first");
        return;
    }

    // Get cart_id from request
    String cartIdParam = request.getParameter("cart_id");
    
    // Validate cart_id parameter
    if (cartIdParam == null || cartIdParam.trim().isEmpty()) {
        response.sendRedirect("cart.jsp?error=Invalid cart item ID");
        return;
    }
    
    int cart_id = Integer.parseInt(cartIdParam.trim());
    
    try {
        Connection conn = DBConnection.getConnection();
        
        // First verify the cart item belongs to the user
        String verifyQuery = "SELECT cart_id FROM cart WHERE cart_id = ? AND user_id = ?";
        PreparedStatement verifyStmt = conn.prepareStatement(verifyQuery);
        verifyStmt.setInt(1, cart_id);
        verifyStmt.setInt(2, user_id);
        ResultSet rs = verifyStmt.executeQuery();
        
        if (!rs.next()) {
            rs.close();
            verifyStmt.close();
            conn.close();
            response.sendRedirect("cart.jsp?error=Cart item not found or access denied");
            return;
        }
        
        rs.close();
        verifyStmt.close();
        
        // Delete the cart item
        String deleteQuery = "DELETE FROM cart WHERE cart_id = ? AND user_id = ?";
        PreparedStatement pstmt = conn.prepareStatement(deleteQuery);
        pstmt.setInt(1, cart_id);
        pstmt.setInt(2, user_id);
        int rowsAffected = pstmt.executeUpdate();
        
        pstmt.close();
        conn.close();
        
        if (rowsAffected > 0) {
            // Redirect back to cart with success message
            response.sendRedirect("cart.jsp?success=Item removed from cart successfully");
        } else {
            // Redirect back to cart with error message
            response.sendRedirect("cart.jsp?error=Failed to remove item from cart");
        }
        
    } catch (NumberFormatException e) {
        response.sendRedirect("cart.jsp?error=Invalid cart item ID format");
    } catch (Exception e) {
        System.out.println("Error removing from cart: " + e.getMessage());
        response.sendRedirect("cart.jsp?error=Database error occurred while removing item");
    }
%>
