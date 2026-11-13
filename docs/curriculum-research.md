# 中学カリキュラム調査メモ

## 出典(公式)
- 文部科学省「中学校学習指導要領(平成29年告示)」本文 https://www.mext.go.jp/content/20230120-mxt_kyoiku02-100002604_02.pdf
  - 数学(A数と式/B図形/C関数/D データの活用)の学年別内容、国語の領域、理科の分野、英語の文法事項・語数、社会の分野別時数(地理115/歴史135/公民100)、数学の時数(140/105/140)は本文で確認済み。
- 葛飾区立中学校の採択教科書(令和8・9年度使用 採択一覧表 中学校用、葛飾区公式サイト)
  - https://www.city.katsushika.lg.jp/_res/projects/default_project/_page_/001/036/251/09tyuugakkou.pdf
  - 国語・書写・道徳=光村図書 / 地理・歴史=教育出版 / 公民・保健体育=東京書籍 / 地図=帝国書院 / 数学・理科=啓林館 / 英語=東京書籍 / 音楽=教育芸術社 / 美術・技術家庭=開隆堂
  - ※令和8年度の表と9年度の表で発行者は同じ。令和7年度の表は未取得(7年度は別の可能性があるため、必要なら確認)。

## データの信頼度
- `official`: 学習指導要領が学年・内容を直接定めている(数学・理科・国語の領域)。
- `typical`: 指導要領は学年を定めていない(英語の文法の学年配当、社会の学年配当・歴史の区分)。一般的な並び。
- 未確認: 数学以外の標準時数。

## 教科書の章立て(テスト範囲「きょうかしょで えらぶ」)
令和7年度版の各教科書の目次順を `js/curriculum.js` の `chapters` に入れた(104章)。
- 数学=啓林館 https://www.shinko-keirin.co.jp/keirinkan/chu_r7/math/file/guide_book_digest.pdf (各学年の章・節を確認)
- 理科=啓林館 https://www.shinko-keirin.co.jp/keirinkan/chu_r7/science/file/guide_book.pdf (年間指導計画案・3学期制標準の単元順)
- 英語=東京書籍 NEW HORIZON 年間指導計画(略案) 1〜3年 https://ten.tokyo-shoseki.co.jp/text/chu/eigo/download/documents/R7eigo_ryakuan_1.pdf (_2, _3 も同様)
- 社会 地理・歴史=教育出版 https://www.kyoiku-shuppan.co.jp/docs/r7chuu/chiri/files/r7chiri_shidousoukatsu.pdf
- 社会 公民=東京書籍 https://ten.tokyo-shoseki.co.jp/tangenl/chu/12083/ (章・節の一覧)
- 国語=光村図書 教材別資料一覧 https://www.mitsumura-tosho.co.jp/kyokasho/c-kokugo/material1nen (material2nen, material3nen)
注意:
- 章と単元の対応づけはAOTOが付けた。数学・理科・社会は章と単元がほぼ1対1。英語は文法項目の近さ、国語は教材の種類(説明文/文学/古典…)による推定。
- 国語1年の「5 筋道を立てて」は教材名を確認できていない(章名のみ)。
- 理科の順は発行者の標準案で、学校の進度とは違うことがある。教育出版の歴史は第4章(近世)が1〜2年にまたがる。
- 教育出版の公民の目次は葛飾区の採択(東京書籍)と違うため使っていない。
- 各教科書の目次PDF自体は著作物なので、章タイトルと単元との対応のみを記録している。
- 音楽・美術・保健体育・技術家庭・道徳の教科書目次は未取り込み。
- 学校ごとの実際の進度(どの章をいつやるか)は分からない。テスト範囲はユーザーが章を選ぶ方式。
- 中1の全単元(国語10・数学7・社会5・理科4・英語5)に問題と説明を入れた(js/content1.js、18スキル・各4問)。中2・中3と音楽・美術などは「じゅんびちゅう」。中1の追加分は問題が少ない(各単元4問)ので、今後ふやす。
