/*用户基本信息参数限制*/
const emailMaxLength = 20;
const passwordMinLength = 6;
const passwordMaxLength = 20;
const nicknameMaxLength = 32;
const phoneMaxLength = 13;
const profileMaxLength = 400;
const avatarMaxSize = 1024 * 1024 * 10;
const personInterestsMaxLength = 16;
const personSmallPictureMaxSize = 500;
export {
    emailMaxLength,
    passwordMaxLength,
    passwordMinLength,
    nicknameMaxLength,
    phoneMaxLength,
    profileMaxLength,
    avatarMaxSize,
    personInterestsMaxLength,
    personSmallPictureMaxSize}

/*动态参数限制*/
const speakWordMaxCount = 300;
const speakPictureMaxCount = 3;
const speakPictureMaxSize = 2; //2MB
const speakBigPictureMaxSize = 350; //350KB
const speakSmallPictureMaxSize = 200; //200KB
const speakInterestsMaxLength = 32; //一个兴趣的最大长度
const speakInterestsMaxCount = 5;
const speakCommentMaxLength = 300;
export {
    speakWordMaxCount,
    speakPictureMaxCount,
    speakPictureMaxSize,
    speakBigPictureMaxSize,
    speakSmallPictureMaxSize,
    speakInterestsMaxLength,
    speakInterestsMaxCount,
    speakCommentMaxLength
}

/*管理员功能参数限制*/
const banReasonMaxLength = 500;
const announcementTitleMaxLength = 32;
const announcementContentMaxLength = 200;
export {
    banReasonMaxLength,
    announcementContentMaxLength,
    announcementTitleMaxLength
}

/*HTTP接口参数限制*/
const countMax = 20;//获取分页的数据时每次最多获取的数据
export {
    countMax
}
