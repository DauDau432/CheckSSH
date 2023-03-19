import os
import paramiko

def check_ssh_connection(ip_address, username, password, success_file):
    # Tạo một máy khách SSH mới
    ssh = paramiko.SSHClient()

    # Tự động thêm khóa máy chủ của máy chủ
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())

    try:
        # Kết nối với máy chủ
        ssh.connect(ip_address, username=username, password=password)
        print("\n  Kết nối SSH thành công IP {}".format(ip_address))
        with open(success_file, "a") as f:
            f.write(ip_address + "\n")
        num_lines = count_lines_in_file(success_file)
        os.system("title    Đã  kết  nối  thành  công   {}   IP".format(num_lines))
    except Exception as e:
        os.system('cls' if os.name == 'nt' else 'clear')  # Xóa màn hình console
        print(" ******************************************************")
        print(" *                                                    *")
        print(" *                    SCAN SSH VPS                    *")                                                                                                                  
        print("  ,--.  ,--. ,-----.      ,--.          ,--.           ")
        print("  |  '--'  |'  .-.  '   ,-|  | ,--,--.,-'  '-. ,--,--. ")
        print("  |  .--.  ||  | |  |  ' .-. |' ,-.  |'-.  .-'' ,-.  | ")
        print("  |  |  |  |'  '-'  '-.\ `-' |\ '-'  |  |  |  \ '-'  | ")
        print("  `--'  `--' `-----'--' `---'  `--`--'  `--'   `--`--' ")                                         
        print("\n\n  Lỗi kết nối IP {}: {}".format(ip_address, e))
    finally:
        # Đóng kết nối SSH
        ssh.close()

def count_lines_in_file(filename):
    with open(filename) as f:
        return sum(1 for _ in f)

# Thông tin đăng nhập SSH
username = "root"
password = "hqdata@9999"

# Đọc danh sách địa chỉ IP từ một tệp
with open("ip.txt", "r") as f:
    ip_list = f.read().splitlines()

# Tên tệp để lưu trữ các kết nối SSH thành công
success_file = "success.txt"

# Kiểm tra kết nối SSH cho từng địa chỉ IP
for ip in ip_list:
    check_ssh_connection(ip, username, password, success_file)

# Yêu cầu người dùng nhập một giá trị bất kỳ trước khi đóng cửa sổ console
print("\n\n ******************************************************")
input("\n  Nhấn Enter để kết thúc chương trình...")
