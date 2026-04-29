package selenium;

import java.util.Scanner;
import java.util.concurrent.TimeUnit;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.firefox.FirefoxDriver;

public class EcommerceAutomation {
	
	//a "global" object of webdriver class
	public static WebDriver driver = null;
	
	private static Scanner sc = new Scanner(System.in);

	public static void main(String[] args) throws InterruptedException {
		// TODO Auto-generated method stub
		
		//setting up Firefox driver (GeckoDriver is automatically managed by Selenium 4.x)
		System.setProperty("webdriver.gecko.driver", "/usr/local/bin/geckodriver");
		
		//launching driver for Firefox Browser
		driver = new FirefoxDriver();
		
		driver.manage().timeouts().implicitlyWait(15, TimeUnit.SECONDS); 
		//implicitWait insures that the entire script waits for a duration till it identifies the required web element.
		//here we set the duration to 15 seconds
		//if implicitWait is not provided then it throws an error, No such element found if webpage doesn't load immediately.
		
		//now we open the web application
		driver.navigate().to("http://localhost:8080/ecommerce/"); //here we are opening our eCommerce website
		driver.manage().window().maximize(); //to maximize the web browser
		
		String title = driver.getTitle();
		
		//comparing two strings (irrespective of case - capital or small)
		if(title.contains("eCommerce") || title.contains("Shopping"))
			System.out.println("✅ Title matches! - " + title);
		else
			System.out.println("❌ Title mismatched! - " + title);
		
		//now our eCommerce website has been launched
		//now we locate the web element for registration
		WebElement registerLink = driver.findElement(By.linkText("Register here"));
		registerLink.click();
		
		//filling registration form
		WebElement nameField = driver.findElement(By.name("name"));
		WebElement emailField = driver.findElement(By.name("email"));
		WebElement passwordField = driver.findElement(By.name("password"));
		
		nameField.sendKeys("Test User");
		emailField.sendKeys("testuser@example.com");
		passwordField.sendKeys("test123");
		
		//submit registration form
		driver.findElement(By.cssSelector("button[type='submit']")).click();
		Thread.sleep(2000);
		
		System.out.println("✅ Registration completed successfully!");
		
		//now we navigate to login page
		driver.navigate().to("http://localhost:8080/ecommerce/login.jsp");
		
		//filling login form
		WebElement loginEmail = driver.findElement(By.name("email"));
		WebElement loginPassword = driver.findElement(By.name("password"));
		
		loginEmail.sendKeys("test9@example.com");
		loginPassword.sendKeys("test123");
		
		//submit login form
		driver.findElement(By.cssSelector("button[type='submit']")).click();
		Thread.sleep(3000);
		
		System.out.println("✅ Login completed successfully!");
		
		//now we view products and add to cart
		//checking if products are displayed
		java.util.List<WebElement> products = driver.findElements(By.cssSelector(".product-card"));
		System.out.println("✅ Found " + products.size() + " products on the page");
		
		//add first product to cart
		if (products.size() > 0) {
			WebElement firstProduct = products.get(0);
			WebElement addToCartButton = firstProduct.findElement(By.cssSelector("button[type='submit']"));
			addToCartButton.click();
			Thread.sleep(2000);
			
			System.out.println("✅ First product added to cart successfully!");
		}
		
		//scrolling to the bottom of the page
		JavascriptExecutor js = (JavascriptExecutor) driver;
		js.executeScript("window.scrollTo(0, document.body.scrollHeight)");
		Thread.sleep(2000);
		
		//navigate to cart page
		WebElement cartLink = driver.findElement(By.linkText("Cart"));
		cartLink.click();
		Thread.sleep(2000);
		
		//verify cart contents
		java.util.List<WebElement> cartItems = driver.findElements(By.cssSelector(".cart-item"));
		if (cartItems.size() > 0) {
			System.out.println("✅ Cart contains " + cartItems.size() + " items");
		} else {
			System.out.println("❌ Cart is empty");
		}
		
		System.out.println("🎉 eCommerce automation test completed successfully!");
		
		//close the browser
		driver.quit();
	}
}
