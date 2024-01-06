import { Card } from './Card'
import { FC, useEffect, useMemo, useState, ChangeEvent } from 'react'
import { Movie } from '../models/Movie'
import * as web3 from '@solana/web3.js'
import { MovieCoordinator } from '../coordinators/MovieCoordinator'
import { Button, Center, HStack, Input, Spacer } from '@chakra-ui/react'
import { useDebounce } from 'usehooks-ts'

export const MovieList: FC = () => {
    const [movies, setMovies] = useState<Movie[]>([])
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState('')
    const debouncedSearch = useDebounce<string>(search, 500)

    const connection = new web3.Connection(web3.clusterApiUrl('devnet'), {
        disableRetryOnRateLimit: false,
    })


    useEffect(() => {
        MovieCoordinator.fetchPage(
            connection, 
            page, 
            5,
            search,
            search !== ''
        ).then(setMovies)
    }, [page, debouncedSearch])

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value)
    }

    return (
        <div>
            <Center>
                <Input
                    id='search'
                    color='gray.400'
                    onChange={handleChange}
                    placeholder='Search'
                    w='97%'
                    mt={2}
                    mb={2}
                />
            </Center>
            {
                movies.map((movie, i) => <Card key={i} movie={movie} /> )
            }
            <Center>
                <HStack w='full' mt={2} mb={8} ml={4} mr={4}>
                    {
                        page > 1 && <Button onClick={() => setPage(page - 1)}>Previous</Button>
                    }
                    <Spacer />
                    {
                        MovieCoordinator.accounts.length > page * 5 &&
                        <Button onClick={() => setPage(page + 1)}>Next</Button>
                    }
                </HStack>
            </Center>
        </div>
    )
}