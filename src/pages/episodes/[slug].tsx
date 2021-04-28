import { GetStaticProps, GetStaticPaths } from 'next';
import Image from 'next/image';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import Link from 'next/link';

import { api } from '../../services/api';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

import styles from './episode.module.scss';
import { usePlayer } from '../../contexts/PlayerContext';
import Head from 'next/head';

type Episode = {
    id: string;
    title: string;
    thumbnail: string;
    members: string;
    duration: number;
    durationAsString: string;
    url: string;
    publishedAt: string;
    description: string;
}
  
type EpisodeProps = {
    episode: Episode;
}

export default function Episode({ episode }: EpisodeProps) {
    
    const { play } = usePlayer();

    return (
        <div className={styles.episode}>
            
            <Head>
                <title>{episode.title} | Podcastr</title>
            </Head>

            <div className={styles.thumbnailContainer}>
                <Link href="/">
                    <button type="button">
                        <img src="/arrow-left.svg" alt="Voltar" />
                    </button>
                </Link>
                
                <Image
                    width={700}
                    height={160}
                    src={episode.thumbnail}
                    objectFit="cover"
                />

                <button type="button" onClick={() => play(episode)}>
                    <img src="/play.svg" alt="Tocar episódio" />
                </button> 
            </div>

            <header>
                <h1>{episode.title}</h1>
                <span>{episode.members}</span>
                <span>{episode.publishedAt}</span>
                <span>{episode.durationAsString}</span>
            </header>

            <div 
                className={styles.description} 
                dangerouslySetInnerHTML={{ __html: episode.description }}
             />
        </div>
    )
}

/**
 * Metodo obrigatorio para paginas estaticas que possuem parametros dinamicos
 * 
 * fallback = false - Nao gera a pagina estatica resultando em 404.
 * 
 * fallback = true - Se não existir a pagina estatica faz a chamada a API para obter os dados
 * e gera a pagina estatica, porem a chamada a API é feita pelo lado do client (browser).
 * Dependendo da requisição os dados podem não estar disponíveis no redirecionamento.
 * Neste caso, podemos retornar um loading utilizando o hook useRouter. Exemplo:
 * const router = useRouter();
 * if (router.isFAllback) {return <p>Carregando...</p>}
 * 
 * fallback = 'blocking' - Faz a chamada a API pelo Node para obter os dados e gera a pagina 
 * estatica mas só redireciona o usuario quando a requisição terminar. 
 * 
 */ 
export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [],
        fallback: 'blocking'
    }
}

// ISG
export const getStaticProps: GetStaticProps = async (ctx) => {
    const { slug } = ctx.params;
    const { data } = await api.get(`/episodes/${slug}`);

    const episode = {
        id: data.id,
        title: data.title,
        thumbnail: data.thumbnail,
        members: data.members,
        publishedAt: format(parseISO(data.published_at), 'd MMM yy', { locale: ptBR }), 
        duration: Number(data.file.duration),
        durationAsString: convertDurationToTimeString(Number(data.file.duration)),
        url: data.file.url,
        description: data.description,
    }

    return {
        props: {
            episode
        },
        revalidate: 60 * 60 * 24, // 24 horas
    }
}