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

public class LoginServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        String email = request.getParameter("email");
        String password = request.getParameter("password");

        if (email == null || password == null || email.trim().isEmpty() || password.trim().isEmpty()) {
            response.sendRedirect("login.jsp?error=All fields are required");
            return;
        }

        try {
            Connection conn = DBConnection.getConnection();
            String sql = "SELECT user_id, name FROM users WHERE email = ? AND password = ?";
            PreparedStatement pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, email);
            pstmt.setString(2, password); // In production, use password hashing!

            ResultSet rs = pstmt.executeQuery();

            if (rs.next()) {
                // User found - create session
                HttpSession session = request.getSession(true);
                session.setAttribute("user_id", rs.getInt("user_id"));
                session.setAttribute("user_name", rs.getString("name"));
                session.setMaxInactiveInterval(30 * 60); // 30 minutes

                rs.close();
                pstmt.close();
                conn.close();

                response.sendRedirect("home.jsp");
            } else {
                // User not found
                rs.close();
                pstmt.close();
                conn.close();
                response.sendRedirect("login.jsp?error=Invalid email or password");
            }
        } catch (Exception e) {
            System.out.println("Error during login: " + e.getMessage());
            response.sendRedirect("login.jsp?error=An error occurred");
        }
    }
}
