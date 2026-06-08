import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './blog'
import BlogForm from "./BlogForm.jsx";

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

test('clicking the like button calls event handler twice', async () => {
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

    const mockHandler = vi.fn()

    render(
        <Blog blog={blog} addLike={mockHandler}/>
    )

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)


    expect(mockHandler.mock.calls).toHaveLength(2)
})


test('<BlogForm /> updates parent state and calls onSubmit', async () => {
    const user = userEvent.setup()
    const createBlog = vi.fn()


    render(<BlogForm createBlog={createBlog} />)

    const title = screen.getByText('title:')
    const author = screen.getByText('author:')
    const url = screen.getByText('url:')
    const sendButton = screen.getByText('Create')

    await user.type(title, 'testing a form...')
    await user.type(author, 'Aleksanteri')
    await user.type(url, 'www.uijuma.fi')
    await user.click(sendButton)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe('testing a form...')
    expect(createBlog.mock.calls[0][0].author).toBe('Aleksanteri')
    expect(createBlog.mock.calls[0][0].url).toBe('www.uijuma.fi')
})