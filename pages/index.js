import React,{ useState, useCallback, useContext, useEffect } from 'react';
import { StorageContext } from "./_app";
import axios from 'axios';
import styles from '../styles/Home.module.css';
import { Input, Button, Grid, Image, Header, Divider, Icon, List } from 'semantic-ui-react';

export default function Home({ items }) {
    const { storages, saveStorage, deleteStorage } = useContext( StorageContext );
    const [ first, ...rest ] = items;

    const [ searchQ, setSearchQ ] = useState( '' );
    const [ loading, setLoading ] = useState( false );
    const [ firstVideo, setFirstVideo ] = useState( first );
    const [ restVideos, setRestVideos ] = useState([ ...storages, ...rest ]);
    const [ playListIds, setPlayListIds ] = useState( '' );

    const getDatas = useCallback( ()=>{
        try {
            setLoading( true );
            setTimeout( async() => {
                const params={
                    key: 'AIzaSyB0saYKW394oUUnzHCUN8C2kt3jdc6ISaY',
                    part:'snippet',
                    q:searchQ,
                    type:'video',
                    maxResults:20
                }; 
                const { data } = await fetch( 'https://www.googleapis.com/youtube/v3/search',{ params });
        
                const { items } = data;
                if ( items ) {
                    const [ f, ...r ] = items;
                    setFirstVideo( f );
                    setRestVideos([ ...storages, ...r ])
                }

                setLoading( false );
            }, 1000 );
        } catch( e ) {
            console.log( e )
        }
    },[ storages, searchQ ]);

    const onChangeSearchInput = useCallback( ( e, { value }) => {
        setSearchQ( value )
    }, []);

    const onKeyPressEnter = useCallback( async({ charCode }) => {
        if ( charCode === 13 ) {
            await getDatas()
        }
    }, [ searchQ ,getDatas ]);

    const onClickVideoItem = useCallback( ( video )=>{
        setFirstVideo( video )
    },[]);

    const onClickShufflePlayList = useCallback( ()=>{
        setPlayListIds( restVideos.map( r=>{return( r.id.videoId )}).join( ',' ) )
    },[ restVideos ]);

    return (
        <div>
            <div>
                <Input
                    className={styles.searchInput} 
                    icon='search' 
                    placeholder='Search...'
                    value={searchQ}
                    onChange={onChangeSearchInput}
                    onKeyPress={onKeyPressEnter}
                />
            </div>
            {
                loading ? (
                    <p className={styles.searchLoadingP}>검색결과 로딩중 ... </p>
                ): firstVideo ? (
                    <div className={styles.mainContents}>
                        <Grid>
                            <Grid.Column width={11}>
                                <iframe className={styles.videoIframe} 
                                    src={`https://www.youtube.com/embed/${ firstVideo?.id.videoId }?autoplay=1&mute=1&playlist=${ playListIds }`}
                                    frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                                <List verticalAlign='middle'>
                                    <List.Item key="first">
                                        <Header>{firstVideo?.snippet.title}</Header>
                                        <List.Content floated='right'>
                                            <Button className={styles.heartBtn} basic icon
                                                onClick={()=>{
                                                    if ( storages.includes( firstVideo ) ) {
                                                        deleteStorage( firstVideo )
                                                    } else {
                                                        saveStorage( firstVideo )
                                                    }
                                                }}
                                            >
                                                {
                                                    storages.includes( firstVideo ) ? (
                                                        <Icon name="heart" size="large" color="red"></Icon>
                                                    )
                                                        : (
                                                            <Icon name="heart outline" size="large"></Icon>
                                                        )
                                                }
                                            </Button>
                                        </List.Content>
                                        
                                        <List.Content>{firstVideo?.snippet.channelTitle}</List.Content>
                                        <Divider />
                                        <List.Content>{firstVideo?.snippet.description}</List.Content>
                                    </List.Item>
                                </List>
                            </Grid.Column>
                            <Grid.Column width={5} >
                                
                                <List relaxed className={styles.thumbnailsList}>
                                    {
                                        restVideos.map( ( video, idx )=>{
                                            const { snippet,id } = video;
                                            const { title, thumbnails, channelTitle } = snippet;
                                            const { medium } = thumbnails;
                                            return(
                                                <List.Item key={id.videoId+idx} className={styles.searchList} onClick={()=>{
                                                    onClickVideoItem( video )
                                                }}>
                                                    <Image alt={medium.url} src={medium.url} as='button' className={styles.thumbnailImg}/>                                           
                                                    {
                                                        storages.includes( video ) && (
                                                            <Icon className={styles.storageIcon} name="heart" size="large" color="red"></Icon>
                                                        )
                                                    }
                                                    <List.Content>
                                                        <List.Header as='a'>{title}</List.Header>
                                                        <List.Description className={styles.thumbnailDescription}>
                                                            {channelTitle}
                                                        </List.Description>
                                                    </List.Content>
                                                </List.Item>
                                            )
                                        })
                                    }
                                </List>
                            </Grid.Column>

                        </Grid>
                    </div>  
                ): (
                    <p className={styles.searchLoadingP}>'{searchQ}' 에 대한 검색결과가 없습니다.</p>
                )
            }
            
        </div>
    )
}

export const getStaticProps = async ( context ) => {
    const { data } = await axios.get( 'https://www.googleapis.com/youtube/v3/search',
        {
            params: {
                key: 'AIzaSyB0saYKW394oUUnzHCUN8C2kt3jdc6ISaY',
                part:'snippet',
                q:'',
                type:'video',
                maxResults:20
            } 
        });
    
    const { items } = data;
    
    // // 데이터가 없으면 notFound를 보낸다 
    if ( !data ) {
        return { notFound: true, }
    }
  
    //{ props: posts } 빌드타임에 받아서 Blog component로 보낸다
    return { props: { items } }
}
  
