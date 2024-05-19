
const local = "http://localhost:5000";

const setUp = async () => {
    const response = await fetch(local+"/clubs");
    const data = await response.json();
    const club_list = data.clubs;
    club_list.forEach( async (club) => {
        const club_id = club.footballAPI_id;
            console.log(club_id);
            try{
                const res = await fetch(local+`/footballAPI/players/${club_id}`);
                const data = await res.json();
                console.log(data);
            }catch(err){
                console.log(err);
            }
            try{
            const m_res = await fetch(local+`/footballAPI/next_match/197/${club_id}`);
            const m = await m_res.json();
             console.log(m);
            }
            catch(err){
                console.log(err);
            }
    }
    );
    return data;
};

setUp();

