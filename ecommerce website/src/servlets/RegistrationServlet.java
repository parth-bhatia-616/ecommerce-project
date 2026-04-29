package servlets;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class RegistrationServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        String name = request.getParameter("name");
        String email = request.getParameter("email");
        String phone = request.getParameter("phone");
        String password = request.getParameter("password");
        String confirmPassword = request.getParameter("confirmPassword");

        // Basic validation
        if (name == null || email == null || phone == null || password == null || confirmPassword == null || 
            name.trim().isEmpty() || email.trim().isEmpty() || phone.trim().isEmpty() || password.trim().isEmpty() || confirmPassword.trim().isEmpty()) {
            response.sendRedirect("registration.jsp?error=All fields are required");
            return;
        }

        name = name.trim();
        email = email.trim().toLowerCase();
        phone = phone.trim();
        password = password.trim();
        confirmPassword = confirmPassword.trim();

        // Name: only letters and spaces
        if (!name.matches("[A-Za-z ]+")) {
            response.sendRedirect("registration.jsp?error=Name must contain only letters");
            return;
        }

        // Phone: exactly 10 digits
        if (!phone.matches("\\d{10}")) {
            response.sendRedirect("registration.jsp?error=Phone number must be exactly 10 digits");
            return;
        }

        // Password: at least one uppercase letter
        if (!password.matches(".*[A-Z].*")) {
            response.sendRedirect("registration.jsp?error=Password must contain at least 1 uppercase letter");
            return;
        }

        // Confirm password: must match
        if (!password.equals(confirmPassword)) {
            response.sendRedirect("registration.jsp?error=Passwords do not match");
            return;
        }

        try {
            Connection conn = DBConnection.getConnection();
            String sql = "INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)";
            PreparedStatement pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, name);
            pstmt.setString(2, email);
            pstmt.setString(3, phone);
            pstmt.setString(4, password); // In production, use password hashing!

            int result = pstmt.executeUpdate();
            
            pstmt.close();
            conn.close();

            if (result > 0) {
                response.sendRedirect("login.jsp?success=Registration successful! Please login");
            } else {
                response.sendRedirect("registration.jsp?error=Registration failed");
            }
        } catch (Exception e) {
            System.out.println("Error during registration: " + e.getMessage());
            e.printStackTrace();
            if (e.getMessage().contains("Duplicate entry")) {
                response.sendRedirect("registration.jsp?error=Email already registered");
            } else {
                response.sendRedirect("registration.jsp?error=An error occurred: " + e.getMessage());
            }
        }
    }
}
