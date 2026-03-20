import json
import random

def generate_lottery_db():
    base_poems = [
        {"poem": "日出便見風雲散，光明清淨照世間。一向前途通大道，萬事清吉保平安。", "meaning": "如旭日東昇般，所有陰霾與困難都會消散。前途光明廣闊，做事都能順利平安。"},
        {"poem": "於今此景正當時，看看欲吐百花魁。若能遇得春色到，一灑清吉脫塵埃。", "meaning": "現在正是時機大好的時候，就像百花即將盛開的春日。"},
        {"poem": "勸君把定心莫虛，天註衣祿自有餘。和合重重常吉慶，時來終遇得明珠。", "meaning": "勸你把心定下來，不要慌亂心虛。上天早已注定你的福份，會有餘裕的。"},
        {"poem": "風恬浪靜可行舟，恰是中秋月一輪。凡事不須多憂慮，福祿自有慶家門。", "meaning": "現在就像風平浪靜的海面可以行船，又如中秋滿月般圓滿明亮。"},
        {"poem": "只恐前途明有變，勸君作急可宜先。且守長江無事處，命逢太白守身邊。", "meaning": "只怕前方的路途會有意想不到的變故，勸你如果能趕緊處理就先處理好。"},
        {"poem": "風雲致雨落洋洋，天災時氣必有傷。命內此事難和合，更作圖求保平安。", "meaning": "如同狂風暴雨造成汪洋一片，天災與氣候的變化必定會帶來傷害。"},
        {"poem": "雲開月出正分明，不須進退問前程。婚姻皆由天註定，和合清吉萬事成。", "meaning": "就像烏雲散去，露出明亮清晰的月亮一樣，你不必再猶豫應該前進還是後退。"},
        {"poem": "禾稻看看結成完，此事必定兩相全。回到家中寬心坐，妻兒鼓舞樂團圓。", "meaning": "稻作看起來已經結穗成熟了，這件事情必定能得到兩全其美的圓滿結果。"},
        {"poem": "龍虎相交在門前，此事必定兩相連。黃金忽然變成鐵，何用作福問神仙。", "meaning": "就像龍與虎在門前交戰一樣，事情的發展必然互相牽連、情況猛烈。"},
        {"poem": "花開結子一半枯，可惜今年汝虛度。漸漸日落西山去，勸君不用向前途。", "meaning": "花雖然開了也結了果子，但卻有一半枯萎了，很可惜你今年可能白費力氣了。"}
    ]
    
    colors = ["緋霞紅", "曜石黑", "琉璃青", "月白", "琥珀黃", "蒼黛", "黛紫", "松石綠"]
    directions = ["正東", "正西", "正南", "正北", "東南", "西南", "東北", "西北"]
    suitables = ["靜心冥想", "踏青接智", "與舊友聯繫", "整理家務", "閱讀古籍", "捐獻佈施", "早起晨曦", "聆聽流水"]
    taboos = ["口出惡言", "過度執著", "晚歸同行", "投資借貸", "決定離職", "穿著過於暗沉", "與人爭論", "動土搬遷"]
    
    db = []
    
    for i in range(1, 61):
        base = base_poems[(i - 1) % len(base_poems)]
        item = {
            "id": i,
            "name": f"第 {i} 籤",
            "poem": base["poem"],
            "meaning": base["meaning"],
            "lucky_color": random.choice(colors),
            "lucky_direction": random.choice(directions),
            "suitable": random.sample(suitables, 2),
            "taboo": random.sample(taboos, 2),
            "auspicious": random.choice(["大吉", "中吉", "小吉", "平", "平", "凶"])
        }
        db.append(item)
        
    with open('mazu_lottery.json', 'w', encoding='utf-8') as f:
        json.dump(db, f, ensure_ascii=False, indent=4)

if __name__ == "__main__":
    generate_lottery_db()
