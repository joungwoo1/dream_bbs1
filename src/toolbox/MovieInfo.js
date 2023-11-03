// 현재 임시로 사용중. 변경 가능성 있음.
export const listGenre = ['액션·무협', '모험', '판타지', '공상', '과학(SF)', '누아르', '전쟁', '코미디']; // 쉼표(,)나 슬래시(/)는 사용하지 말아주세요

export const listAgeLimit = [ // limit(제한 연령)가 작은 순서대로 넣어주세요
    { name: '전체', limit: 0 },
    { name: '12세 이상', limit: 12 },
    { name: '15세 이상', limit: 15 },
    { name: '18세 이상', limit: 18 }
];

export const findAgeLimit = (userAge, index) => {
    if (userAge >= listAgeLimit[index].limit) {
        if (index === listAgeLimit.length - 1) {
            return index;
        } else {
            return findAgeLimit(userAge, index + 1)
        }
    } else {
        return index - 1;
    }
}

export const findFavoriteGenre = (favor) => {
    if (favor.length === 0) {
        return [];
    } else {
        let genreCount = [0];
        genreCount.length = listGenre.length;
        genreCount.fill(0);
        for (let i = 0; i < listGenre.length; i++) {
            favor?.map(genre => (
                genre?.includes(listGenre[i]) ? genreCount[i]++ : null
            ));
        }
        let biggest = 0;
        let most = []; // 가장 많이 본 장르(여러개 존재할 경우 전부 집어넣습니다)
        for (let i = 0; i < listGenre.length; i++) {
            if (genreCount[i] > biggest) {
                most = [listGenre[i]];
                biggest = genreCount[i];
            }
            else if (genreCount[i] === biggest) {
                most.push(listGenre[i]);
            }
        }
        return most;
    }
}