import { render, screen } from '@testing-library/react'
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