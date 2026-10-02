from playwright.sync_api import sync_playwright

def test():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        # Capture console messages
        page.on("console", lambda msg: print(f"CONSOLE [{msg.type}]: {msg.text}"))
        page.on("pageerror", lambda err: print(f"PageError: {err}"))
        
        print("Visiting https://led.fedu.vn/cu.html...")
        page.goto("https://led.fedu.vn/cu.html", wait_until="networkidle")
        
        screenshot_path = "nghiemthu_screenshot.png"
        page.screenshot(path=screenshot_path, full_page=True)
        
        browser.close()

if __name__ == "__main__":
    test()
