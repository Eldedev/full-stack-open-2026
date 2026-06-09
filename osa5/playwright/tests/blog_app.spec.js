const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
    beforeEach(async ({ page, request }) => {
        await request.post('http://localhost:3003/api/testing/reset')
        await request.post('http://localhost:3003/api/users', {
            data: {
                name: 'Matti Luukkainen',
                username: 'mluukkai',
                password: 'salainen'
            }
        })

        await page.goto('http://localhost:5173')
    })

    test('Login form is shown', async ({ page }) => {
        const usernameField = page.getByLabel("username")
        const passwordField = page.getByLabel("password")

        await expect(usernameField).toBeVisible()
        await expect(passwordField).toBeVisible()
    })
    describe('Login', () => {
        test('succeeds with correct credentials', async ({ page }) => {
            await page.getByLabel('username').fill('mluukkai')
            await page.getByLabel('password').fill('salainen')
            await page.getByRole('button', { name: 'login' }).click()

            const errorDiv = page.locator('.error')
            await expect(errorDiv).not.toBeVisible()

            await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
        })

        test('fails with wrong credentials', async ({ page }) => {
            await page.getByLabel('username').fill('mluukkai')
            await page.getByLabel('password').fill('wrong')
            await page.getByRole('button', { name: 'login' }).click()

            const errorDiv = page.locator('.error')
            await expect(errorDiv).toContainText('wrong credentials')
            await expect(errorDiv).toHaveCSS('border-style', 'solid')
            await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

            await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
        })
    })
    describe('When logged in', () => {
        beforeEach(async ({ page }) => {
            await page.getByLabel('username').fill('mluukkai')
            await page.getByLabel('password').fill('salainen')
            await page.getByRole('button', { name: 'login' }).click()
        })

        test('a new blog can be created', async ({ page }) => {
            await page.getByRole('button', { name: 'create' }).click()
            await page.getByRole('textbox', {name: "title"}).fill('a blog created by')
            await page.getByRole('textbox', {name: "author"}).fill('Elias joopakko')
            await page.getByRole('textbox', {name: "url"}).fill('www.miksei.com')
            await page.getByRole('button', { name: 'create' }).click()
            await expect(page.locator(".blog-container").filter({hasText: "a blog created by Elias joopakko"})).toBeVisible()
        })

        describe('and several notes exists', () => {
            beforeEach(async ({ page }) => {
                await page.getByRole('button', { name: 'create' }).click()
                await page.getByRole('textbox', {name: "title"}).fill('a blog created by')
                await page.getByRole('textbox', {name: "author"}).fill('Elias joopakko')
                await page.getByRole('textbox', {name: "url"}).fill('www.miksei.com')
                await page.getByRole('button', { name: 'create' }).click()

                await expect(page.locator(".blog-container").filter({hasText: "a blog created by Elias joopakko"})).toBeVisible()

                await page.getByRole('button', { name: 'create' }).click()
                await page.getByRole('textbox', {name: "title"}).fill('a 2nd blog created by')
                await page.getByRole('textbox', {name: "author"}).fill('Aleksi salminen')
                await page.getByRole('textbox', {name: "url"}).fill('www.tässä.com')
                await page.getByRole('button', { name: 'create' }).click()

                await expect(page.locator(".blog-container").filter({hasText: "a 2nd blog created by Aleksi salminen"})).toBeVisible()
            })

            test('blog can be liked', async ({ page }) => {
                const firstBlogElement = page.locator(".blog-container").filter({hasText: "a blog created by Elias joopakko"})

                await firstBlogElement.getByRole('button', { name: 'view' }).click()

                const firstBlog = page.locator(".blog").filter({ hasText: "a blog created by Elias joopakko"})

                await firstBlog.getByRole("button", {name: "like"}).click()

                await expect(firstBlog.locator(".like-count")).toHaveText("1")
            })

            test('blog can be delted', async ({ page }) => {
                const firstBlogElement = page.locator(".blog-container").filter({hasText: "a blog created by Elias joopakko"})

                await firstBlogElement.getByRole('button', { name: 'view' }).click()

                const firstBlog = page.locator(".blog").filter({ hasText: "a blog created by Elias joopakko"})

                page.on("dialog", async dialog => {
                    expect(dialog.message()).toBe("Remove blog a blog created by by Elias joopakko")
                    await dialog.accept()
                })

                await firstBlog.getByRole("button", {name: "remove"}).click()


                await expect(page.locator(".blog-container").filter({hasText: "a blog created by Elias joopakko"})).not.toBeVisible()
                await expect(page.locator(".blog").filter({hasText: "a blog created by Elias joopakko"})).not.toBeVisible()

            })
        })
    })
})