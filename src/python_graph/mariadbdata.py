import mariadb
import sys
import pandas as pd
from sklearn import datasets

# Connect to MariaDB Platform
try:
    conn = mariadb.connect(
        user="root",
        password="root",
        host="localhost",
        port=3306,
        database="dbdb"
    )
except mariadb.Error as e:
    print(f"Error connecting to MariaDB Platform: {e}")
    sys.exit(1)

# Get Cursor
cur = conn.cursor()
# selectall = "SELECT genre_names from t_tmdb_movie" 
# DB 에서 movie에 있는 genre 데이터 프레임으로 가져오기
select_from_tmdb_movie = "SELECT g.name, COUNT(*) cnt from t_tmdb_genre as g, t_tmdb_movie as m WHERE m.genre_names in ('%',g.name, '%') GROUP BY g.name , m.genre_names"
cur.execute(select_from_tmdb_movie)
res = cur.fetchall()
data = pd.DataFrame.from_records(res)

print(data)

