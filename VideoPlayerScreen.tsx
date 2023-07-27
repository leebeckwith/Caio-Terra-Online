import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Video from 'react-native-video';

const VideoPlayerScreen = ({ route }: { route: any }) => {
    // Extract the parameters passed from navigation
    const { vimeoId, vimeoToken } = route.params;
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null); // Store the video URL

    useEffect(() => {
        getVimeoVideo(vimeoId);
    }, [vimeoId]);

    const getVimeoVideo = async (vimeoId: number) => {
        try {
            // Construct the Vimeo API URL for the specific video
            const vimeoApiUrl = `https://api.vimeo.com/videos/${vimeoId}`;

            // Fetch the video data from the Vimeo API
            const response = await fetch(vimeoApiUrl, {
                headers: {
                    Authorization: `Bearer ${vimeoToken}`, // Include the Vimeo Bearer token in the request headers
                },
            });

            // Parse the response and get the video data
            const videoData = await response.json();

            // Set the video data to the selectedVideo state
            setSelectedVideo(videoData.files[2].link);
        } catch (error) {
            console.error('Error fetching video from Vimeo API:', error);
            setSelectedVideo(null); // Reset selectedVideo in case of an error
        }
    };

    return (
        <View>
            {selectedVideo ? (
                <View>
                    <Video
                        source={{ uri: selectedVideo }}
                        ref={(ref) => {
                            // @ts-ignore
                            this.player = ref
                        }}                                      // Store reference
                        style={styles.videoPlayer}
                        resizeMode="contain"
                        controls={true}
                    />
                    <Text>{selectedVideo}</Text>
                </View>
            ) : (
                <View>
                    <Text>Vimeo ID: {vimeoId}</Text>
                    <Text>Vimeo Token: {vimeoToken}</Text>
                    <Text>Loading video...</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        padding: 10,
    },
    videoPlayer: {
        width: '100%',
        height: 300,
        backgroundColor: '#050505',
    },
});

export default VideoPlayerScreen;
