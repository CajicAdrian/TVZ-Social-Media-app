import { Box, IconButton, Text } from "@chakra-ui/react";
import React, { ReactElement } from "react";
import { FaHeart } from "react-icons/fa";
import { toggleLike } from "api";

interface Props {
    postId: number;
    likedByCurrentUser: boolean;
    likeCount: number;
    onChange: () => void;
}

export const Likes = ({ postId, likedByCurrentUser, likeCount, onChange }: Props): ReactElement => {
    const onLike = async () => {
        console.log('LIKE!');
        await toggleLike(postId, !likedByCurrentUser);
        onChange();
    };

    return (
        <Box textAlign="center">
            <IconButton variant="ghost" colorScheme={likedByCurrentUser? 'red' : 'gray'} onClick={onLike} aria-label="Like" icon={<FaHeart />} />
            <br/>
            <Text color="green.500" mt="1">
                {likeCount}
            </Text>
        </Box>
    );
}