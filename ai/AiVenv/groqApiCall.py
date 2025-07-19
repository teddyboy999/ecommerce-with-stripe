import os
from groq import Groq
from dotenv import load_dotenv

# Access environment variables
load_dotenv()
groq_api_key = os.getenv("GROQ_API_KEY")

# PROMPT -------------------------------------------------------------------------------------------------------------------------------------
data = """
System Message-
"""

system_message = """
**OBJECTIVE-**
I need end-to-end Playwright tests for my specific e-commerce web app.  
  
**Features and UI structure:**  
- (IMPORTANT) - You are supposed to test on local, use this link: await page.goto('http://localhost:3000/');  
- On page load, there is a "Let's start the QA Hackathon" button. The user clicks this to see the shop.  
- Products are shown as <article> elements. Each article has:  
  - A product name (e.g. "🍙 Onigiri", "🌯 Buritto", "🍮 Pudding")  
  - The price (e.g. "¥120")  
  - A quantity indicator between '-' and '+' buttons (initially 1)  
  - An "Add to cart" button for each product.  
- The cart icon ("shopping cart icon") in the navigation shows the current total # of items.  
- When the cart is opened, the cart page lists each added product ("🍙 Onigiri (2) ¥120") and the TOTAL price at the bottom.  
- "Proceed to checkout" is disabled if the cart is empty.  
- There is also a "business-link" with data-testid="business-link" that should be present after starting.  
- All product images should have meaningful alt attributes.  
  
**Write Playwright tests for:** 
- Verify that the application loads correctly on all supported devices (monitor, PC, smartphone, tablet).
- Test app loads when cookies/localStorage are disabled
- Ensure items can be added to the cart.
- Verify the calculation of total price and quantity is correct after adding items.
- Test the maximum number of items (20 items) can be added to the cart.
- Check that an error message is displayed when trying to add more than 20 items.
- Ensure items can be removed from the cart.
- Verify that the quantity cannot be reduced below zero.
- Check that if the cart is empty, the user cannot proceed to payment, and an appropriate message is displayed.
- Verify the calculation of total price and quantity is correct after removing items.
- Test with different combinations of items to ensure calculations are consistent.
- Calculate the price: Check the total amount is it correct according to according to each item 
- Cart Persistence: Refresh the page and verify that items remain in the cart.

**Different Devices Test**-
- Please use this code when writing the test for responsive web page, it needs to be able to test for all of these sizes-
'''
const devices = [  
  { name: 'Desktop', width: 1280, height: 800 },  
  { name: 'PC', width: 1024, height: 768 },  
  { name: 'Smartphone', width: 375, height: 667 },  
  { name: 'Tablet', width: 768, height: 1024 },  
];  
'''
  
**Use accurate selectors like**  
- `page.getByRole('article', { name: /onigiri/i })` for product articles  
- Button names as presented in the UI (not just 'Add to Cart' globally)  
- Cart total as displayed (look for "Total: ¥..." text, not #total-price)  
  
**Do NOT use generic IDs and DO NOT assume all products/prices are the same. Use real product names and prices.**  
  
**OUTPUT**
ONLY OUTPUT THE CODE, nothing else.
"""
# End of Prompt ------------------------------------------------------------------------------------------------------------------------------





# Groq model API Call ------------------------------------------------------------------------------------------------------------------------------
client = Groq()
completion = client.chat.completions.create(
    model="meta-llama/llama-4-scout-17b-16e-instruct",
    messages=[
      {
        "role": "system",
        "content": data + system_message
      },
      {
        "role": "user",
        "content": "Generate the playwright tests based on given instructions."
      }
    ],
    temperature=1,
    max_completion_tokens=8192,
    top_p=1,
    stream=True,
    stop=None,
)

result_text = ""

for chunk in completion:
    result_text += chunk.choices[0].delta.content or ""
    print(chunk.choices[0].delta.content or "", end="")
# Groq model API Call End ------------------------------------------------------------------------------------------------------------------------------



# Write final code to an executable test file ------------------------------------------------------------------------------------------------------------------------------
def writeToFile(output_path, text):
    lines = text.splitlines(keepends=True)  # keepends=True preserves line breaks
    content_to_write = lines[1:-1]          # Exclude first and last line
    with open(output_path, "w") as outfile:
        outfile.writelines(content_to_write)

## Automated Testing
output_file_path = "../../tests/generated_playwright_tests.test.js"
writeToFile(output_file_path, result_text)

