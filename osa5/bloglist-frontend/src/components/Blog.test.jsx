import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './blog'

test('renders content', () => {
    const user = {
        username: 'Elde',
        name: 'Elias'
    }
    const blog = {
        title: 'Component testing is done with react-testing-library',
        author: 'Alex Stubb',
        url: 'Herewego.eu',
        user: user
    }

    render(<Blog blog={blog} />)

    const element = screen.getAllByText('Component testing is done with react-testing-library', { exact: false })
    expect(element).toBeDefined()
})

test('clicking the button calls event handler once and shows extra info', async () => {
    const user1 = {
        username: 'Elde',
        name: 'Elias'
    }
    const blog = {
        title: 'Component testing is done with react-testing-library',
        author: 'Alex Stubb',
        url: 'Herewego.eu',
        user: user1
    }

    render(
        <Blog blog={blog} />
    )

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const div = document.querySelector('.blog')

    expect(div).toBeVisible()
})