
import { IPost } from '../helpers/types';
import { BASE } from '../helpers/default'

interface Props {
    posts: IPost[]
}

export function Gallery({ posts }: Props) {
    return (
        <div className='list'>
            {
                posts.map(post => {
                    return <div key={post.id}>
                        <img
                            src={BASE + post.picture}
                        />
                        <p>{post.title} <small>({post.likes.length} likes</small>)</p>
                        <img
                            className='small-icon'
                            src="https://cdn4.iconfinder.com/data/icons/utilities-part-3/64/empty_heart-512.png"
                        />
                    </div>

                })
            }
        </div>
    )
}