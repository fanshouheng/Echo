#!/usr/bin/env python3
"""
TOML 配置文件验证脚本
用于验证 netlify.toml 语法是否正确
"""

import sys
import traceback

def validate_toml():
    try:
        # 尝试导入 tomllib (Python 3.11+)
        try:
            import tomllib
            mode = 'rb'
        except ImportError:
            # 对于 Python 3.11 以下版本，使用 toml 包
            try:
                import toml as tomllib
                mode = 'r'
            except ImportError:
                print("❌ 错误: 请安装 toml 包: pip install toml")
                return False

        # 验证 netlify.toml 文件
        try:
            with open("netlify.toml", mode) as f:
                data = tomllib.load(f)

            print("✅ TOML 语法验证通过!")
            print(f"📄 配置文件包含 {len(data)} 个顶级配置块")

            # 显示主要配置
            if 'build' in data:
                build = data['build']
                print(f"🔨 构建命令: {build.get('command', '未设置')}")
                print(f"📁 发布目录: {build.get('publish', '未设置')}")

            if 'redirects' in data:
                print(f"🔀 重定向规则: {len(data['redirects'])} 条")

            if 'headers' in data:
                print(f"🏷️  头部规则: {len(data['headers'])} 组")

            if 'functions' in data:
                print(f"⚡ 函数配置: 已设置")

            return True

        except FileNotFoundError:
            print("❌ 错误: 未找到 netlify.toml 文件")
            return False
        except Exception as e:
            print(f"❌ TOML 语法错误: {e}")
            print("💡 请检查以下常见问题:")
            print("   - 字符串是否正确用引号包围")
            print("   - 括号是否正确配对")
            print("   - 是否有多余的逗号")
            print("   - 键名是否包含特殊字符")
            return False

    except Exception as e:
        print(f"❌ 验证脚本错误: {e}")
        traceback.print_exc()
        return False

if __name__ == "__main__":
    print("🔍 验证 netlify.toml 配置文件...")
    print("=" * 40)

    success = validate_toml()

    if success:
        print("=" * 40)
        print("🎉 配置文件验证成功，可以安全部署!")
    else:
        print("=" * 40)
        print("🚨 配置文件有问题，请修复后再部署!")
        sys.exit(1)