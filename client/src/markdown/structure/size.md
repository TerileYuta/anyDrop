# 転送技術

anyDropではユーザーの大切なファイルを安全に転送するためにシステムが扱いやすいサイズごとに一つのファイルを分割してからそれらを一斉に送信し、クライアント側で再結合させるというプロセスでファイル転送を行っております。そのため、理論的には最大約１TBまでの大きさのファイルであれば一度に転送することができます。