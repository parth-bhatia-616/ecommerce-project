package servlets;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

public class AddToCartServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("user_id") == null) {
            response.sendRedirect("login.jsp?error=Please login first");
            return;
        }

        Integer user_id = (Integer) session.getAttribute("user_id");
        int product_id = Integer.parseInt(request.getParameter("product_id"));

        try {
            Connection conn = DBConnection.getConnection();
            
            // Check if product already exists in cart
            String checkSql = "SELECT cart_id, quantity FROM cart WHERE user_id = ? AND product_id = ?";
            PreparedStatement checkStmt = conn.prepareStatement(checkSql);
            checkStmt.setInt(1, user_id);
            checkStmt.setInt(2, product_id);
            ResultSet rs = checkStmt.executeQuery();

            if (rs.next()) {
                // Update quantity if product already in cart
                int currentQty = rs.getInt("quantity");
                String updateSql = "UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?";
                PreparedStatement updateStmt = conn.prepareStatement(updateSql);
                updateStmt.setInt(1, currentQty + 1);
                updateStmt.setInt(2, user_id);
                updateStmt.setInt(3, product_id);
                updateStmt.executeUpdate();
                updateStmt.close();
            } else {
                // Insert new item in cart
                String insertSql = "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, 1)";
                PreparedStatement insertStmt = conn.prepareStatement(insertSql);
                insertStmt.setInt(1, user_id);
                insertStmt.setInt(2, product_id);
                insertStmt.executeUpdate();
                insertStmt.close();
            }

            rs.close();
            checkStmt.close();
            conn.close();

            response.sendRedirect("home.jsp?success=Product added to cart");
        } catch (Exception e) {
            System.out.println("Error adding to cart: " + e.getMessage());
            response.sendRedirect("home.jsp?error=Error adding product to cart");
        }
    }
}
